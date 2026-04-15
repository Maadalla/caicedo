import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const networkConfig = `Commandes ICMP (Ping & Routage) :

ping <IP>
Vérifie si la machine répond aux requêtes ICMP.

ping -f -l <taille> <IP> (Windows)
ping -s <taille> -M do <IP> (Linux)
Permet de trouver la taille maximale (MTU) d'un paquet avant fragmentation.

ping -i <valeur> <IP>
Modifie le TTL (Time To Live).

tracert <domaine/IP> (Windows)
traceroute <domaine/IP> (Linux)
Affiche les routeurs traversés (hops).

Découverte DNS (dig) :

dig <domaine>
Renvoie l'adresse IP du domaine.

dig <domaine> NS
Liste les serveurs DNS.

dig <domaine> MX
Liste les serveurs mail.

dig <domaine> CNAME
Affiche les alias.

dig +trace <domaine>
Affiche le chemin complet de résolution DNS.

dig -x <IP>
Recherche inversée (IP → domaine).

Phase 2 : Scanning avec Nmap

nmap -sn <IP>
Ping scan (machine active ou non).

nmap -Pn <IP>
Ignore le ping (scan même si bloqué).

nmap -n <IP>
Désactive la résolution DNS.

Types de scan :

nmap -sS <IP>
Scan SYN (furtif).

nmap -sT <IP>
Scan TCP complet.

nmap -sU <IP>
Scan UDP.

nmap -sF <IP>
Scan FIN.

nmap -sX <IP>
Scan Xmas.

Ciblage :

nmap -p 80 <IP>
Scan un port spécifique.

nmap -p 22,80 <IP>
Scan plusieurs ports.

nmap -p- <IP>
Scan tous les ports.

nmap -p U:53,T:25 <IP>
Scan UDP et TCP combiné.

nmap -F <IP>
Scan rapide (ports courants).

nmap -T4 <IP>
Scan rapide.

nmap -T2 <IP>
Scan lent.

Identification :

nmap -O <IP>
Détecte le système d'exploitation.

nmap -sV <IP>
Version des services.

nmap -A <IP>
Scan complet (OS + version + scripts + traceroute).

Phase 3 : Énumération

nbtscan <plage_IP>
Trouve les machines Windows.

nbtstat -a <IP>
Table NetBIOS distante.

nbtstat -c
Cache NetBIOS local.

net view \\<IP>
Liste les partages.

net use \\<IP>\<dossier>
Connexion à un partage.

Enum4linux :

enum4linux -a <IP>
Énumération complète.

enum4linux -U <IP>
Liste des utilisateurs.

enum4linux -S <IP>
Partages réseau.

enum4linux -P <IP>
Politique de mots de passe.

SMB :

smbclient //IP/dossier -N
Connexion anonyme.

SNMP :

snmp-check <IP>
Infos SNMP.

Phase 4 : Exploitation (Metasploit)

msfconsole
Lance Metasploit.

Dans msfconsole :

search <faille>
Cherche un exploit.

use <module>
Sélectionne un module.

set RHOST <IP>
Définit la cible.

set LHOST <IP>
Définit l'attaquant.

run
Lance l'exploit.

Post-exploitation :

hashdump
Récupère les mots de passe (hash).
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