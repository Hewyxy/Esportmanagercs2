import { useEffect, useState } from 'react'

export default function FirstTimeLogIn() {
  // Show the setup form when the profile is empty and keep the entered details.
  const [profile, setProfile] = useState(null)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [nickname, setNickname] = useState('')
  const [teamName, setTeamName] = useState('')
  const [profileError, setProfileError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    // Check the profile when the app opens.
    let cancelled = false

    fetch('http://localhost:3000/api/user/profile/0')
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Could not load profile')
        return data
      })
      .then(data => {
        if (cancelled) return
        setProfile(data)
        if (data.Username && data.Username !== 'No Name') setNickname(data.Username)
        if (data.TeamName && data.TeamName !== 'No Name') setTeamName(data.TeamName)
      })
      .catch(error => { if (!cancelled) setProfileError(error.message) })
      .finally(() => { if (!cancelled) setProfileLoaded(true) })

    return () => { cancelled = true }
  }, [])

  const needsProfile = !profile ||
    !profile.Username || profile.Username === 'No Name' ||
    !profile.TeamName || profile.TeamName === 'No Name'

  async function saveProfile(event) {
    // Save the nickname and team name on the server.
    event.preventDefault()
    setSavingProfile(true)
    setProfileError('')

    try {
      const response = await fetch('http://localhost:3000/api/user/profile/0', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: nickname, teamName })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not save profile')
      setProfile({ id: data.id, Username: data.username, TeamName: data.teamName })
      window.dispatchEvent(new CustomEvent('profile-updated', {
        detail: { username: data.username, teamName: data.teamName }
      }))
    } catch (error) {
      setProfileError(error.message)
    } finally {
      setSavingProfile(false)
    }
  }

  if (!profileLoaded || !needsProfile) return null

  return (
    <div className="profile-setup-backdrop">
      <form className="profile-setup" onSubmit={saveProfile}>
        <p className="profile-setup__eyebrow">WELCOME TO CS2 ESPORT MANAGER</p>
        <h1>Create your profile</h1>
        <p>Enter your nickname and team name to begin.</p>
        <label htmlFor="profile-nickname">Nickname</label>
        <input
          id="profile-nickname"
          value={nickname}
          onChange={event => setNickname(event.target.value)}
          maxLength={20}
          required
          autoFocus
        />
        <label htmlFor="profile-team">Team Name</label>
        <input
          id="profile-team"
          value={teamName}
          onChange={event => setTeamName(event.target.value)}
          maxLength={48}
          required
        />
        {profileError && <p className="profile-setup__error" role="alert">{profileError}</p>}
        <button type="submit" disabled={savingProfile}>
          {savingProfile ? 'Saving...' : 'Start'}
        </button>
      </form>
    </div>
  )
}
