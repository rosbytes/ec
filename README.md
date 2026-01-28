# ec

JWT Secrets and auth endpoints has to differ for different level of 
users like consumer, vendor, support, {admin => just for overseeing}

# TODO

- [ review cart and address logic ]
- [ discovery module ]

Db has temp visitor called boardUser =>
in future its responsibilities should be offloaded to mandi
and mandi may has a central authority to monitory or controll them.

Please set expiry on refreshTokens while saving them in cache