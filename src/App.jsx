import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const networkConfig = `#Switch
enable
configure terminal
vlan 10
vlan 20
exit
interface range gig0/1-2
switchport mode trunk

! Configuration du port pour PC0 (VLAN 10)
interface fa0/1
switchport mode access
switchport access vlan 10
exit

! Configuration du port pour PC1 (VLAN 20)
interface fa0/2
switchport mode access
switchport access vlan 20
exit

! Configuration du port pour PC2 (VLAN 10)
interface fa0/1
switchport mode access
switchport access vlan 10
exit

! Configuration du port pour PC3 (VLAN 20)
interface fa0/2
switchport mode access
switchport access vlan 20
exit

#Switch 3560
enable
configure terminal
vlan 10
vlan 20
exit
interface range gig0/1-2
switchport trunk encapsulation dot1q
switchport mode trunk

#Switch 3560 A
spanning-tree vlan 10 root primary
spanning-tree vlan 20 root secondary
ip routing
! Configuration pour le VLAN 10 (DS1 sera Actif)
interface vlan 10
ip address 192.168.10.2 255.255.255.0
standby 10 ip 192.168.10.1
standby 10 priority 110
standby 10 preempt

! Configuration pour le VLAN 20 (DS1 sera Standby)
interface vlan 20
ip address 192.168.20.2 255.255.255.0
standby 20 ip 192.168.20.1
standby 20 preempt

#Switch 3560 B
spanning-tree vlan 20 root primary
spanning-tree vlan 10 root secondary
ip routing
! Configuration pour le VLAN 10 (DS2 sera Standby)
interface vlan 10
ip address 192.168.10.3 255.255.255.0
standby 10 ip 192.168.10.1
standby 10 preempt

! Configuration pour le VLAN 20 (DS2 sera Actif)
interface vlan 20
ip address 192.168.20.3 255.255.255.0
standby 20 ip 192.168.20.1
standby 20 priority 110
standby 20 preempt

#Switch 3560 A
enable
configure terminal
interface fa0/1
no switchport
ip address 192.168.2.2 255.255.255.0
no shutdown
exit

#Switch 3560 B
enable
configure terminal
interface fa0/1
no switchport
ip address 192.168.1.2 255.255.255.0
no shutdown
exit

#Routeur 
enable
configure terminal

! Liaison vers DS1
interface gig0/0
ip address 192.168.2.1 255.255.255.0
no shutdown
exit

! Liaison vers DS2
interface gig0/1
ip address 192.168.1.1 255.255.255.0
no shutdown
exit

#Switch 3560 A
enable
configure terminal
ip route 0.0.0.0 0.0.0.0 192.168.2.1

#Switch 3560 B
enable
configure terminal
ip route 0.0.0.0 0.0.0.0 192.168.1.1

#Routeur 
enable
configure terminal
! Route vers le VLAN 10 via DS1
ip route 192.168.10.0 255.255.255.0 192.168.2.2

! Route vers le VLAN 20 via DS2
ip route 192.168.20.0 255.255.255.0 192.168.1.2

#Switch 3560 A
enable
configure terminal
! 1. Créer le module de surveillance sur l'interface Fa0/1
track 1 interface fa0/1 line-protocol

! 2. Appliquer la surveillance au groupe HSRP du VLAN 10
interface vlan 10
standby 10 track 1 decrement 20
exit

#Switch 3560 B
enable
configure terminal
track 2 interface fa0/1 line-protocol

interface vlan 20
standby 20 track 2 decrement 20
exit


-----T3-T1
	R1
		enable
		configure terminal

		interface g0/0
		ip address 192.168.1.2 255.255.255.0
		no shutdown

		standby 1 ip 192.168.1.1
		standby 1 priority 110
		standby 1 preempt
	
	R2
		enable
		configure terminal

		interface g0/0
		ip address 192.168.1.3 255.255.255.0
		no shutdown

		standby 1 ip 192.168.1.1
		standby 1 preempt
		
-----T3-T2
	Switch L3 -1
		enable
		configure terminal

		vlan 10
		exit
		vlan 20
		exit
		
		ip routing
		
		interface ge0/1
				switchport trunk encapsulation dot1q
				switchport mode trunk
				
			VLAN 10
				interface vlan 10
				ip address 192.168.10.2 255.255.255.0
				no shutdown
				
				standby 10 ip 192.168.10.1
				standby 10 priority 110
				standby 10 preempt
				exit
				
			VLAN 20
				interface vlan 20
				ip address 192.168.20.2 255.255.255.0
				no shutdown
				
				standby 20 ip 192.168.20.1
				standby 20 priority 110
				standby 20 preempt
				exit
		
	Switch L3 -1
		enable
		configure terminal

		vlan 10
		exit
		vlan 20
		exit
		
		ip routing
		
		interface ge0/1
				switchport trunk encapsulation dot1q
				switchport mode trunk
				
			VLAN 10
				interface vlan 10
				ip address 192.168.10.3 255.255.255.0
				no shutdown
				
				standby 10 ip 192.168.10.1
				standby 10 preempt
				exit

			VLAN 20
				interface vlan 20
				ip address 192.168.20.3 255.255.255.0
				no shutdown
		
				standby 20 ip 192.168.20.1
				standby 20 preempt
				exit
				
	Switch 
		vlan 10
		exit
		vlan 20
		exit
		
		interface range fa0/1-3
		switchport mode access
		switchport access vlan 10

		interface range fa0/4-6
		switchport mode access
		switchport access vlan 20
		

-----T3-T3
	R1	
		interface g0/0 
		ip address 192.168.1.1 255.255.255.0
		no shutdown
		
		interface g0/1
		ip address 192.168.2.1 255.255.255.0
		no shutdown

		ip route 192.168.10.0 255.255.255.0 192.168.1.2
		ip route 192.168.20.0 255.255.255.0 192.168.2.2

	L3 -1
		interface g0/2
		 no switchport
		 ip address 192.168.1.2 255.255.255.0
		 no shutdown
		 
	L3 -2 
		interface g0/2
		 no switchport
		 ip address 192.168.2.2 255.255.255.0
		 no shutdown
		 
		 
-----T3-T4
	R1	
		conf t
		no ip route 192.168.10.0 255.255.255.0 192.168.1.2
		no ip route 192.168.20.0 255.255.255.0 192.168.2.2

		router ospf 1
		 router-id 1.1.1.1

		network 192.168.1.0 0.0.0.255 area 0
		network 192.168.2.0 0.0.0.255 area 0

	L3-1
		conf t
		router ospf 1
		 router-id 2.2.2.2

		network 192.168.10.0 0.0.0.255 area 0
		network 192.168.20.0 0.0.0.255 area 0
		network 192.168.1.0 0.0.0.255 area 0

	L3-2
		conf t
			router ospf 1
			 router-id 3.3.3.3

		network 192.168.10.0 0.0.0.255 area 0
		network 192.168.20.0 0.0.0.255 area 0
		network 192.168.2.0 0.0.0.255 area 0

-----T3-T5
	R1	
		wr
		
		interface g0/0
		ip nat inside
		exit
		
		interface g0/1
		ip nat inside
		exit
		
		interface se0/3/0
		ip address 1.1.1.2 255.255.255.252
		no shutdown
		
		ip nat outside
		exit
		
		access-list 1 permit 192.168.10.0 0.0.0.255
		access-list 1 permit 192.168.20.0 0.0.0.255
		
		ip nat inside source list 1 interface se0/3/0 overload
	
		ip route 0.0.0.0 0.0.0.0 1.1.1.1
		
		router ospf 1
		default-information originate
	R2
		interface se0/3/0
		ip address 1.1.1.1 255.255.255.252
		no shutdown
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