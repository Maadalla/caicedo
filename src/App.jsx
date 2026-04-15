import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const networkConfig = `

ping <IP>
ping -f -l <taille> <IP>
ping -s <taille> -M do <IP>
ping -i <valeur> <IP>
tracert <domaine/IP>
traceroute <domaine/IP>

dig <domaine>
dig <domaine> NS
dig <domaine> MX
dig <domaine> CNAME
dig +trace <domaine>
dig -x <IP>

nmap -sn <IP>
nmap -Pn <IP>
nmap -n <IP>
nmap -sS <IP>
nmap -sT <IP>
nmap -sU <IP>
nmap -sF <IP>
nmap -sX <IP>
nmap -p <port> <IP>
nmap -p- <IP>
nmap -p U:53,T:25 <IP>
nmap -F <IP>
nmap -T<0-5> <IP>
nmap -O <IP>
nmap -sV <IP>
nmap -A <IP>

nbtscan <plage_IP>
nbtstat -a <IP>
nbtstat -c
net view \\<IP>
net use \\<IP>\<dossier>

enum4linux -a <IP>
enum4linux -U <IP>
enum4linux -S <IP>
enum4linux -P <IP>

smbclient //IP/dossier -N
snmp-check <IP>

msfconsole
search <nom_de_la_faille>
use <chemin_du_module>
set RHOST <IP_cible>
set LHOST <IP_attaquant>
run
exploit
hashdump
		`;

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px' }}>
      
      <pre 
        style={{
           // Dark background like a terminal
                     // Hacker green text
          padding: '24px',
          borderRadius: '8px',
          overflowX: 'auto',          // Adds a scrollbar if the text gets too wide
          fontFamily: 'normal',
          textAlign: 'left',
          fontSize: '15px'
        }}
      >
        <code>{networkConfig}</code>
      </pre>
    </div>
  )
}

export default App