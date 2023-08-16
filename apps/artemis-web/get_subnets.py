from ipaddress import ip_network as str2ip
import sys

hijacked_prefix = str2ip(sys.argv[1])
hijacked_prefix_len = hijacked_prefix.prefixlen

deagg_len_threshold = 32

if hijacked_prefix.version == 6:
    deagg_len_threshold = 64

if hijacked_prefix_len < deagg_len_threshold:
    subnets = list(map(str, list(hijacked_prefix.subnets())))

    print(subnets)

