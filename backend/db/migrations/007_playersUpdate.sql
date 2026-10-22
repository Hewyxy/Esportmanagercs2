UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/ofUYfMzSFIXBKy0Nmuu8_8.png?ixlib=java-2.1.0&w=400&s=b5efac7a107026c1cc04a02be9a5276e'
WHERE Id = 179;

UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/j27UdpFKnNPvDOu2YHjNPV.png?ixlib=java-2.1.0&w=400&s=027775ff3662b04ffd11a910c33ee24c'
WHERE Id = 29;

-- Luminosity Pics update
UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/ObPp7ZDUn9_5K-e6VmfjpQ.png?ixlib=java-2.1.0&w=400&s=8768eafeb52644bf5514d2a31a100497'
WHERE Id = 136;

UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/0Q_g4jit5lQgQOqBi7xzQ7.png?ixlib=java-2.1.0&w=400&s=c816e975e157654bfab176d2157b6bd1'
WHERE Id = 137;

UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/MKFjIZu5HoEkGmMq0Beekj.png?ixlib=java-2.1.0&w=400&s=34ae568717c5bca04c7c68df6ff44c73'
WHERE Id = 138;

UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/a7t_p3tlEAmX9CYjbv4i0N.png?ixlib=java-2.1.0&w=400&s=9f6dd52dcdb6489d07ea3e6a89be56c5'
WHERE Id = 139;

UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/VHG4ns4UbWQYS-HXuDNYjT.png?ixlib=java-2.1.0&w=400&s=951900223bb5b78e1469f5f2457180da'
WHERE Id = 150;


--Adding new Player
INSERT INTO Players (
    Name, Team, TeamId, Role, Image, TeamImage,
    Firepower, Entrying, Trading, Opening, Snipping, Utill
)
SELECT
    'shalfey',
    'None',
    0,
    'IGL',
    'https://img-cdn.hltv.org/playerbodyshot/mKl7gAfs9r_zhwqgu1dTy-.png?ixlib=java-2.1.0&w=400&s=61f2f84221ffd94335d60c318b0c51fa',
    'https://www.hltv.org/dynamic-svg/teamplaceholder',
    91, 22, 65, 62, 18, 11
WHERE NOT EXISTS (
    SELECT 1
    FROM Players
    WHERE Name = 'shalfey'
);

Update Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/N5LTczzYJhM_SOoJHyODQf.png?ixlib=java-2.1.0&w=400&s=2522d65fd901be70cb1760c7dc680123'
WHERE Name = 'FL4MUS';

UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/Cvsx7uyeznfZm9QKL84T_9.png?ixlib=java-2.1.0&w=400&s=ff884941d46ef84788cb09867e6d9345',
Name = 'cobrazera',
Firepower = 81,
Entrying = 14,
Trading = 77,
Opening = 50,
Utill = 47
WHERE Id = 176;

UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/biOoj0RdE1iWdYlNZ2B6zt.png?ixlib=java-2.1.0&w=400&s=b39726a7e6894883a3b4d886a23863a2',
Name = 'Alkaren',
Firepower = 67,
Entrying = 40,
Trading = 46,
Opening = 75,
Snipping = 92,
Utill = 50
WHERE Id = 70;



UPDATE Players
SET Image = 'https://img-cdn.hltv.org/playerbodyshot/xrXlmInMyLuHlUfwDiiS_8.png?ixlib=java-2.1.0&w=400&s=1605c93c62d735f639f859460dac545f',
Name = 'nin9',
Firepower = 58,
Entrying = 16,
Trading = 25,
Opening = 70,
Utill = 86
WHERE Id = 69;






UPDATE Players
SET Rating = ROUND((
    Firepower * 0.30 +
    Entrying  * 0.20 +
    Trading   * 0.15 +
    Opening   * 0.15 +
    Utill     * 0.20
) * 1.20)
WHERE Role != 'AWPer';


UPDATE Players
SET Rating = ROUND((
    Firepower * 0.20 +
    Entrying  * 0.05 +
    Trading   * 0.10 +
    Opening   * 0.15 +
    Snipping  * 0.40 +
    Utill     * 0.10
) * 1.20)
WHERE Role = 'AWPer';
