from ipaddress import ip_network as str2ip

hijacked_prefix = str2ip("2001:648:2c30::/48")
hijacked_prefix_len = hijacked_prefix.prefixlen

deagg_len_threshold = 32

if hijacked_prefix.version == 6:
    deagg_len_threshold = 64

if hijacked_prefix_len < deagg_len_threshold:
    subnets = list(map(str, list(hijacked_prefix.subnets())))

    print(subnets)

