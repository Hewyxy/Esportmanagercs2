"""Fetch team rankings from HLTV."""

import requests

from bs4 import BeautifulSoup

#Insert recent link here
url = "https://www.hltv.org/ranking/teams/2026/september/21"

response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

players = soup.select(".player")

for player in players:
    name = player.select_one(".name").text.strip()
    team = player.select_one(".team").text.strip()

    print(name, team)
