UPDATE Players
SET TeamId = CASE
    WHEN Team = 'None' THEN 0
    ELSE (
        SELECT Teams.Id
        FROM Teams
        WHERE Teams.Name = Players.Team
    )
END
WHERE Team = 'None'
   OR EXISTS (
       SELECT 1
       FROM Teams
       WHERE Teams.Name = Players.Team
   );