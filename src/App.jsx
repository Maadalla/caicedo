import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>
        #Switch
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









      </p>
    </>
  )
}

export default App
