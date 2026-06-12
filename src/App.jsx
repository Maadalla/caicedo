import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('WAN_TP2');

  // Les configurations extraites de vos nouveaux fichiers WAN
  const files = {
    WAN_TP2: `WAN

----------------------------------Topologie 1

Étape 1 — Configuration de base R1 et R2
	Sur R1 :
		enable
		configure terminal
		hostname R1
		interface serial 0/0/0
		 ip address 1.1.1.1 255.255.255.252
		 no shutdown
		exit
	Sur R2 :
		enable
		configure terminal
		hostname R2
		interface serial 0/0/0
		 ip address 1.1.1.2 255.255.255.252
		 no shutdown
		exit

Étape 2 — Tester la connectivité
	R1# ping 1.1.1.2

Étape 3 — Déterminer DCE et DTE
	R1# show controllers serial 0/0/0

Étape 4 — Changer le clock rate sur le DCE (R1)
	R1(config)# interface serial 0/0/0
	R1(config-if)# clock rate 2000000

Étape 5 — Essayer clock rate sur DTE (R2)
	R2(config)# interface serial 0/0/0
	R2(config-if)# clock rate 2000000

Étape 6 — Afficher le type d'encapsulation
	R1# show interfaces serial 0/0/0
	R2# show interfaces serial 0/0/0

Étape 7 — Changer l'encapsulation en PPP sur R1 puis tester
	R1(config)# interface serial 0/0/0
	R1(config-if)# encapsulation ppp

Pour rétablir la connectivité, configurer PPP sur R2 aussi :
	R2(config)# interface serial 0/0/0
	R2(config-if)# encapsulation ppp
	R1# ping 1.1.1.2
	
	
----------------------------------Topologie 2 

Étape 1 — Configuration R1
	enable
	configure terminal
	hostname R1
	
	! Interface LAN
		interface GigabitEthernet0/0
		 ip address 192.168.10.1 255.255.255.0
		 no shutdown
		exit
		
	! Interface série vers R3
		interface serial 0/0/0
		 ip address 10.1.1.1 255.255.255.252
		 clock rate 2000000
		 encapsulation ppp
		 ppp authentication pap
		 ppp pap sent-username R1 password cisco
		 no shutdown
		exit
		
	! Route par défaut vers R3
		ip route 0.0.0.0 0.0.0.0 10.1.1.2

Étape 2 — Configuration R2
	enable
	configure terminal
	hostname R2
	
	! Interface LAN
		interface GigabitEthernet0/0
		 ip address 192.168.30.1 255.255.255.0
		 no shutdown
		exit
		
	! Interface série vers R3
		interface serial 0/0/1
		 ip address 10.2.2.2 255.255.255.252
		 encapsulation ppp
		 ppp authentication pap
		 ppp pap sent-username R2 password cisco
		 no shutdown
		exit
		
	! Route par défaut vers R3
		ip route 0.0.0.0 0.0.0.0 10.2.2.1

Étape 3 — Configuration R3 (routeur central)
	enable
	configure terminal
	hostname R3
	
	! Liaison série vers R1 — PAP
		interface serial 0/0/0
		 ip address 10.1.1.2 255.255.255.252
		 encapsulation ppp
		 ppp authentication pap
		 ppp pap sent-username R3 password cisco
		 no shutdown
		exit
		
	! Liaison série vers R2 — PAP
		interface serial 0/0/1
		 ip address 10.2.2.1 255.255.255.252
		 clock rate 2000000
		 encapsulation ppp
		 ppp authentication pap
		 ppp pap sent-username R3 password cisco
		 no shutdown
		exit
		
	! Liaison série vers ISP — CHAP
		interface serial 0/1/0
		 ip address 209.165.200.225 255.255.255.252
		 encapsulation ppp
		 ppp authentication chap
		 no shutdown
		exit
		
	! Comptes utilisateurs pour PAP et CHAP
		username R1 password cisco
		username R2 password cisco
		username ISP password cisco
		
	! Routage EIGRP entre R1, R2, R3
		router eigrp 1
		 network 10.1.1.0 0.0.0.3
		 network 10.2.2.0 0.0.0.3
		 network 209.165.200.224 0.0.0.3
		 no auto-summary
		exit
		
	! Route vers Internet
		ip route 0.0.0.0 0.0.0.0 209.165.200.226

Étape 4 — Configuration ISP
	enable
	configure terminal
	hostname ISP
	
	! Liaison série vers R3 — CHAP
		interface serial 0/1/0
		 ip address 209.165.200.226 255.255.255.252
		 clock rate 2000000
		 encapsulation ppp
		 ppp authentication chap
		 no shutdown
		exit
	! Interface vers Web server
		interface GigabitEthernet0/0
		 ip address 209.165.200.1 255.255.255.0
		 no shutdown
		exit
		
		username R3 password cisco
		ip route 0.0.0.0 0.0.0.0 209.165.200.225

Étape 5 — Configuration PC et Laptop

Étape 6 — Vérification (questions 9, 10, 11)
	! Q9 — Encapsulation par défaut (avant changement)
	R1# show interfaces serial 0/0/0
	! → Encapsulation HDLC

	! Q10 — Vérifier PPP activé
	R1# show interfaces serial 0/0/0
	! → Encapsulation PPP, LCP Open

	! Q11 — Vérifier authentification PAP/CHAP
	R3# show ppp all
	R1# debug ppp authentication`,

    WAN_TP3: `------------------------------topologie 1/2

Étape 1 — Configuration du commutateur Frame Relay (cloude pt)
	config -> serial0 -> DLCI 102 
	config -> serial1 -> DLCI 201
	frame-relay -> serial0 - serial1

Étape 2 — Configuration R1 (mappage dynamique)
	enable
	configure terminal
	hostname R1

	interface serial 0/0/0
	 ip address 10.1.1.1 255.255.255.0
	 encapsulation frame-relay
	 no frame-relay inverse-arp
	 frame-relay map ip 10.1.1.2 102 broadcast
	 no shutdown
	exit

Étape 3 — Configuration R2 (mappage dynamique)
	enable
	configure terminal
	hostname R2

	interface serial 0/0/0
	 ip address 10.1.1.2 255.255.255.0
	 encapsulation frame-relay
	 no frame-relay inverse-arp
	 frame-relay map ip 10.1.1.1 201 broadcast
	 no shutdown
	exit

Étape 4 — Configuration R3 (mappage dynamique)
	enable
	configure terminal
	hostname R3

	interface serial 0/0/0
	 ip address 10.2.2.1 255.255.255.0
	 encapsulation frame-relay
	 frame-relay map ip 10.2.2.2 304 broadcast
	 no shutdown
	exit

Étape 5 — Configuration R4 (mappage dynamique)
	enable
	configure terminal
	hostname R4

	interface serial 0/0/0
	 ip address 10.2.2.2 255.255.255.0
	 encapsulation frame-relay
	 frame-relay map ip 10.2.2.1 403 broadcast
	 no shutdown
	exit
	
	
------------------------------topologie 4

Cloud-PT Frame Relay

From Port     Sublink    To Port       Sublink
Serial0 (R1)  102        Serial2 (R3)  301
Serial1 (R2)  203        Serial2 (R3)  302

R1
	enable
	configure terminal
	hostname R1

	! LAN
	interface GigabitEthernet0/0
	 ip address 192.168.10.1 255.255.255.0
	 no shutdown
	exit

	! Frame Relay vers R3 uniquement (hub)
	interface serial 0/3/0
	 ip address 10.1.1.1 255.255.255.0
	 encapsulation frame-relay
	 frame-relay map ip 10.1.1.3 102 broadcast    
	 no shutdown
	exit

	! RIP
	router rip
	 version 2
	 network 192.168.10.0
	 network 10.0.0.0
	 no auto-summary
	exit

R2
	enable
	configure terminal
	hostname R2

	! LAN
	interface GigabitEthernet0/0
	 ip address 192.168.30.1 255.255.255.0
	 no shutdown
	exit

	! Frame Relay vers R3 uniquement (hub)
	interface serial 0/3/0
	 ip address 10.1.1.2 255.255.255.0
	 encapsulation frame-relay
	 frame-relay map ip 10.1.1.3 203 broadcast   
	 no shutdown
	exit

	! RIP
	router rip
	 version 2
	 network 192.168.30.0
	 network 10.0.0.0
	 no auto-summary
	exit

R3 (Hub)
	enable
	configure terminal
	hostname R3

	! Frame Relay vers R1 et R2
	interface serial 0/3/1
	 ip address 10.1.1.3 255.255.255.0
	 encapsulation frame-relay
	 frame-relay map ip 10.1.1.1 301 broadcast   
	 frame-relay map ip 10.1.1.2 302 broadcast   
	 no ip split-horizon                          
	 no shutdown
	exit

	! Liaison vers ISP
	interface serial 0/2/0
	 ip address 209.165.200.225 255.255.255.224
	 no shutdown
	exit

	! RIP
	router rip
	 version 2
	 network 10.0.0.0
	 network 209.165.200.0
	 no auto-summary
	 default-information originate                
	exit

	! Route par défaut vers Internet
	ip route 0.0.0.0 0.0.0.0 209.165.200.226

ISP (Cluster0)
	enable
	configure terminal
	hostname ISP

	interface serial 0/3/0
	 ip address 209.165.200.226 255.255.255.224
	 clock rate 64000
	 no shutdown
	exit

	interface GigabitEthernet0/0
	 ip address 209.165.200.1 255.255.255.252
	 no shutdown
	exit

	ip route 0.0.0.0 0.0.0.0 209.165.200.225
	
	
------------------------------topologie 5
	
Étape 1 — Cloud-PT Frame Relay
From Port     Sublink    To Port       Sublink
Serial0 (R1)  102        Serial2 (R3)  301
Serial0 (R1)  103        Serial2 (R3)  302
Serial1 (R2)  201        Serial2 (R3)  303
Serial1 (R2)  203        Serial2 (R3)  304

Étape 2 — Configuration R1
	enable
	configure terminal
	hostname R1

	! LAN
	interface GigabitEthernet0/0
	 ip address 192.168.10.1 255.255.255.0
	 no shutdown
	exit

	! Interface physique — pas d'IP ici !
	interface serial 0/3/0
	 encapsulation frame-relay
	 no shutdown
	exit

	! Sous-interface vers R3 — PVC1 (DLCI 102)
	interface serial 0/3/0.1 point-to-point
	 ip address 10.1.1.1 255.255.255.252
	 frame-relay interface-dlci 102
	exit

	! Sous-interface vers R3 — PVC2 (DLCI 103)
	interface serial 0/3/0.2 point-to-point
	 ip address 10.1.3.2 255.255.255.252
	 frame-relay interface-dlci 103
	exit

	! EIGRP
	router eigrp 1
	 network 192.168.10.0
	 network 10.1.1.0 0.0.0.3
	 network 10.1.3.0 0.0.0.3
	 no auto-summary
	exit

Étape 3 — Configuration R2
	enable
	configure terminal
	hostname R2

	! LAN
	interface GigabitEthernet0/0
	 ip address 192.168.30.1 255.255.255.0
	 no shutdown
	exit

	! Interface physique — pas d'IP ici !
	interface serial 0/3/0
	 encapsulation frame-relay
	 no shutdown
	exit

	! Sous-interface vers R3 — PVC3 (DLCI 201)
	interface serial 0/3/0.1 point-to-point
	 ip address 10.1.1.2 255.255.255.252
	 frame-relay interface-dlci 201
	exit

	! Sous-interface vers R3 — PVC4 (DLCI 203)
	interface serial 0/3/0.3 point-to-point
	 ip address 10.1.2.1 255.255.255.252
	 frame-relay interface-dlci 203
	exit

	! EIGRP
	router eigrp 1
	 network 192.168.30.0
	 network 10.1.1.0 0.0.0.3
	 network 10.1.2.0 0.0.0.3
	 no auto-summary
	exit

Étape 4 — Configuration R3 (Hub)
	enable
	configure terminal
	hostname R3

	! Interface physique — pas d'IP ici !
	interface serial 0/3/0
	 encapsulation frame-relay
	 no shutdown
	exit

	! Sous-interface vers R1 PVC1 (DLCI 301)
	interface serial 0/3/0.1 point-to-point
	 ip address 10.1.1.2 255.255.255.252
	 frame-relay interface-dlci 301
	exit

	! Sous-interface vers R1 PVC2 (DLCI 302)
	interface serial 0/3/0.2 point-to-point
	 ip address 10.1.3.1 255.255.255.252
	 frame-relay interface-dlci 302
	exit

	! Sous-interface vers R2 PVC3 (DLCI 303)
	interface serial 0/3/0.3 point-to-point
	 ip address 10.1.1.2 255.255.255.252
	 frame-relay interface-dlci 303
	exit

	! Sous-interface vers R2 PVC4 (DLCI 304)
	interface serial 0/3/0.4 point-to-point
	 ip address 10.1.2.2 255.255.255.252
	 frame-relay interface-dlci 304
	exit

	! Liaison vers ISP
	interface serial 0/2/0
	 ip address 209.165.200.225 255.255.255.224
	 no shutdown
	exit

	! EIGRP
	router eigrp 1
	 network 10.1.1.0 0.0.0.3
	 network 10.1.3.0 0.0.0.3
	 network 10.1.2.0 0.0.0.3
	 network 209.165.200.0 0.0.0.31
	 no auto-summary
	exit

	! Route par défaut vers Internet
	ip route 0.0.0.0 0.0.0.0 209.165.200.226

Étape 5 — Configuration ISP
	enable
	configure terminal
	hostname ISP

	interface serial 0/3/0
	 ip address 209.165.200.226 255.255.255.224
	 clock rate 64000
	 no shutdown
	exit

	interface GigabitEthernet0/0
	 ip address 209.165.200.1 255.255.255.252
	 no shutdown
	exit

	ip route 0.0.0.0 0.0.0.0 209.165.200.225`,

    WAN_TP4: `--------------------Topologie 1 

Étape 1 — Configurer Server_FAI
	Champ Valeur IP 1.1.1.1
	Masque 255.255.255.0

	Activer aussi le service DHCP sur Server_FAI pour distribuer les IPs aux clients câble :

	Dans Services → DHCP :
	Pool Name    : CablePool
	Default GW   : 1.1.1.1
	DNS Server   : 1.1.1.1
	Start IP     : 1.1.1.10
	Subnet Mask  : 255.255.255.0
	Max Users    : 50

Étape 2 — Configurer le Cloud FAI

	⚠️ Utiliser la section DSL (pas Cable) avec des DSL Modems !
	Dans Config → DSL :
	From Port	To Port
	Modem4		Ethernet6
	Modem5		Ethernet6

	Connexions physiques :
	Câble			De				Vers
	Phone (tirets)	Cloud Modem4	DSL Modem1 Port0
	Phone (tirets)	Cloud Modem5	DSL Modem2 Port0
	Ethernet droit	Cloud Ethernet6	Switch0 Fa0/2

Étape 3 — Configurer DSL Modem1 (vers PC0)
	Connexions physiques :
	Câble				De					Vers
	Phone				DSL Modem1 Port0	Cloud Modem4
	Ethernet droit		DSL Modem1 Port1	PC0 Fa0

	PC0 configuré en DHCP → obtient IP automatiquement


Étape 4 — Configurer DSL Modem2 + Wireless Router
	Connexions physiques :

	Câble			De					Vers
	Phone			DSL Modem2 Port0	Cloud Modem5
	Ethernet droit	DSL Modem2 Port1	WirelessRouter 0/0

	Configuration Wireless Router — GUI :
	Onglet Internet Setup (WAN) :
	Champ						Valeur
	Internet Connection Type	Automatic Configuration - DHCP

	✅ Le routeur obtient son IP automatiquement via DSL Modem2

	Onglet Network Setup (LAN) :
	Champ			Valeur
	Router IP		192.168.1.1
	Subnet Mask		255.255.255.0
	DHCP Server		Enabled
	Start IP		192.168.1.100
	Max Users		50
	➡️ Cliquer Save Settings

	Onglet Wireless :
	Champ				Valeur
	SSID 				HomeWifi
	Channel6			SecurityWPA2 
	PersonalPassword	cisco123
	➡️ Cliquer Save Settings

Étape 5 — Connecter Laptop0 au WiFi
	Sur Laptop0 :

	Aller dans Config → Wireless0
	SSID : HomeWifi
	Password : cisco123
	IP : DHCP

--------------------Topologie 2`
  };

  // Les styles de l'interface graphique
  const styles = {
    appContainer: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      display: 'flex',
      flexDirection: 'column'
    },
    navBar: {
      display: 'flex',
      backgroundColor: '#252526',
      borderBottom: '1px solid #333',
      padding: '0 10px',
    },
    button: {
      padding: '12px 20px',
      backgroundColor: 'transparent',
      color: '#969696',
      border: 'none',
      borderTop: '2px solid transparent',
      cursor: 'pointer',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    activeButton: {
      color: '#ffffff',
      backgroundColor: '#1e1e1e',
      borderTop: '2px solid #007acc',
    },
    codeContainer: {
      padding: '20px',
      flex: 1,
      overflowY: 'auto'
    },
    pre: {
      backgroundColor: '#1e1e1e',
      padding: '15px',
      borderRadius: '5px',
      fontFamily: '"Fira Code", monospace',
      fontSize: '14px',
      whiteSpace: 'pre-wrap',
      margin: 0
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* Barre de navigation (les boutons) */}
      <div style={styles.navBar}>
        {Object.keys(files).map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            style={{
              ...styles.button,
              ...(activeTab === tabName ? styles.activeButton : {})
            }}
          >
            {tabName}.txt
          </button>
        ))}
      </div>

      {/* Affichage du code correspondant au bouton */}
      <div style={styles.codeContainer}>
        <pre style={styles.pre}>
          <code>{files[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
}