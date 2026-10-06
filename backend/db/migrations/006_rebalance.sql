Update Players SET Utill = 52 WHERE id = 185; --Hewyxy Nerf
Update Players SET Firepower = 85 WHERE id = 188; --SlowKing nerf
Update Players SET Firepower = 56 WHERE id = 184; --Kill3r00six
Update Players SET Entrying = 43 WHERE id = 186;  --Pe4enk nerf
Update Players SET Firepower = 59 WHERE id = 189; --05KD nerf
Update Players SET Snipping = 60 WHERE id = 190; --T1a nerf
Update Players SET Firepower = 48 WHERE id = 193; --Folder nerf
Update Players SET Firepower = 73, Name = 'wojx' WHERE id = 194; --wojx nerf
Update Players SET Entrying = 45 WHERE id = 192; --Delamik nerf

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

