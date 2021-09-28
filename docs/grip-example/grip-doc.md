# Description

This feature is implementing the connection with CAIDA's grip project https://grip-dev.caida.org .

## Testing the event integration (steps by @vkotronis)

- Visit https://grip-dev.caida.org/events.
- Select one event per type (moas, submoas, edges, defcon), 4 events in total.
- Use the Raw JSON on each event to get detailed info and store them locally.
- Write some sample BGP updates (4 in total) that would violate this configuration when entering ARTEMIS, again consulting https://bgpartemis.readthedocs.io/en/latest/basicconf/#examples . The format of the file with the updates should be csv; an example can be found here: https://github.com/FORTH-ICS-INSPIRE/ripe79_artemis_demo/blob/master/artemis_test_updates/announcements.csv Format: prefix|origin|peer|as_path|mon_project|collector|A|"[]"|timestamp e.g., 10.0.0.0/16|1|10|10 4 2 1|mon-project-1|mon-group-1|A|"[]"|1571184000. Store them in a .csv file.
- Build an ARTEMIS configuration file that when violated, would create these events exactly. See the detailed docs page https://bgpartemis.readthedocs.io/en/latest/basicconf/#examples with examples on this (pairs of BGP updates and configuration snippets). The configuration should be a compliant ARTEMIS config, e.g., https://github.com/FORTH-ICS-INSPIRE/artemis/blob/master/backend-services/configs/config.yaml
- Now you can replay these updates as "history". Follow the instructions on this page https://bgpartemis.readthedocs.io/en/latest/history/ (ignore bgpstream_retrieve_prefix_records.py), map your volumes correctly and start bgpstreamhisttap. You should see hijacks pertaining to your 4 cases in ARTEMIS. You can then test if these hijacks contain the links you expect.


# Comprehensive details on how to test a moas event

1. You get the raw json of the GRIP event, e.g., https://api.grip.caida.org/dev/json/event/id/moas-1630649100-38858_65033_9336
2. You check the "details" section of the "pfx_events": "old_origins" contains the original legal origin, "new_origins" contains the hijacker, "prefix" is the affected prefix.
3. Under local_configs build a folder named grip-hijacks
4. In-folder, add a new file with the hijack update named e.g., moas-hijack.csv. Sample content in our case:

`203.15.172.0/24|9336|10|10 4 9336|test-project|test-collector|A|"[]"|1571184000`

(follows the following format: <prefix>|<origin_asn>|<peer_asn>|<blank_separated_as_path>|<project>|<collector>|<update_type_A_or_W>|<bgpstream_community_json_dump>|<timestamp>)

5. Now set the historic variable to true and map the grip-hijacks folder in the needed microservices (configuration, bgpstreamhisttap):

  > vassilis@vassilis-Latitude-7520 ~/projects/artemis (master)$ git diff  
  > diff --git a/.env b/.env  
  > index d76c1110..b2e3c6ca 100644  
  > --- a/.env  
  > +++ b/.env  
  > @@ -4,7 +4,7 @@ COMPOSE_PROJECT_NAME=artemis  
  >  DB_VERSION=24  
  >  GUI_ENABLED=true  
  >  SYSTEM_VERSION=latest  
  > -HISTORIC=false  
  > +HISTORIC=true  
  >   
  >  \# Redis config  
  >  REDIS_HOST=redis  
  > diff --git a/docker-compose.yaml b/docker-compose.yaml  
  > index 621491c9..55e5cfd4 100644  
  > --- a/docker-compose.yaml  
  > +++ b/docker-compose.yaml  
  > @@ -110,6 +110,7 @@ services:  
  >          volumes:  
  >              - ./local_configs/monitor/logging.yaml:/etc/artemis/logging.yaml  
  >              - ./monitor-services/bgpstreamhisttap/entrypoint:/root/entrypoint  
  >  +            - ./local_configs/grip-hijacks/:/tmp/grip-hijacks/  
  >      exabgptap:  
  >          image: inspiregroup/artemis-exabgptap:${SYSTEM_VERSION}  
  >          build: ./monitor-services/exabgptap/  
  > @@ -235,6 +236,7 @@ services:  
  >          volumes:  
  >              - ./local_configs/backend/:/etc/artemis/  
  >              - ./backend-services/configuration/entrypoint:/root/entrypoint  
  >  +            - ./local_configs/grip-hijacks/:/tmp/grip-hijacks/  
  >      database:  
  >          image: inspiregroup/artemis-database:${SYSTEM_VERSION}  
  >          build: ./backend-services/database/  

6. Boot ARTEMIS and set the configuration according to the legal origin, example:
  >  in prefixes section:  
  >  
  > grip-moas-prefix: &grip-moas-prefix  
  > - 203.15.172.0/24  
  >   
  > in monitors section:  
  >   
  > bgpstreamhist: '/tmp/grip-hijacks/'  
  >  
  > in asns section:  
  >  
  > legal-grip-moas-origin: &legal-grip-moas-origin  
  > - 38858  
  >  
  > in rules section:  
  >  
  > - prefixes:  
  > - *grip-moas-prefix  
  > origin_asns:  
  > - *legal-grip-moas-origin  
  > mitigation: manual  
  
1. Now activate the detection service
2. Next activate the bgpstreamhist service
3. You should be able to see the hijack now; this should be connected to the corresponding initial GRIP event, assuming that your code works correctly
