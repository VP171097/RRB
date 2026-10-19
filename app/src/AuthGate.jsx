import { useGlobal } from './global.jsx'
import { useI18n } from './i18n.jsx'
import { LangPicker } from './LangPicker.jsx'
import { InstallButton } from './install.jsx'
import { SignIn } from './pages/Community.jsx'

// Shown before the app opens until the person is signed in. The session is kept on the device, so this appears again only after Sign out.
const photo = new URL('../landing/trains/vande-bharat.jpg', window.location.href).href

export default function AuthGate({ cloud }) {
  const { t } = useI18n()
  const { g, set } = useGlobal()
  return (
    <div className="auth">
      <aside className="auth-hero" style={{ backgroundImage: `linear-gradient(100deg,rgba(7,32,79,.92) 10%,rgba(7,32,79,.55) 70%,rgba(7,32,79,.35)),url(${photo})` }}>
        <div className="auth-brand"><b>MR</b> Mission RRB</div>
        <div className="auth-copy">
          <h1>{t('Your RRB exam plan, one station at a time.')}</h1>
          <ul className="pts">
            <li>{t('A study plan built from your start date, exam date and daily hours')}</li>
            <li>{t('Lessons, tricks, quizzes and mock tracking in English and Hindi')}</li>
            <li>{t('Your progress saved to your account, on every device')}</li>
          </ul>
        </div>
        <a className="auth-credit" href="https://commons.wikimedia.org/wiki/File:Ahmedabad–Okha_Vande_Bharat_Express.jpg" target="_blank" rel="noopener noreferrer">{t('Photo: Wikimedia Commons, CC BY-SA 4.0')}</a>
      </aside>
      <main className="auth-panel">
        <div className="auth-top">
          <LangPicker value={g.lang} onChange={(lang) => set({ lang })} label={t('Language')} />
        </div>
        <div className="auth-box">
          <h2>{t('Welcome to Mission RRB')}</h2>
          <p className="small muted" style={{ margin: '0 0 14px' }}>{t('Sign in or create an account to open the app. You stay signed in on this device until you tap Sign out.')}</p>
          <SignIn cloud={cloud} bare />
          <div className="auth-install">
            <InstallButton className="btn ghost" label={t('Install the app on this device')} />
          </div>
        </div>
      </main>
    </div>
  )
}
