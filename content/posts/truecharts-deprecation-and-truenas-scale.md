---
title: "Truecharts Deprecation and TrueNAS SCALE"
date: 2024-07-12T02:37:34Z
image: /images/posts/post-5.jpg
categories:
  - Homelab
post_id: B111D9E7-FF74-4131-9416-7EC7AE08BB5A
draft: false
---

## History

iXsystems is known for their very stable and well adopted enterprise NAS operating system TrueNAS CORE. This is ran on FreeBSD. In 2022, they released TrueNAS SCALE. SCALE is ran on top of Debian Linux, and thus can be run on a broader range of hardware, making it an option for a broader market.[^1] 
s
When initially deciding on requirements for SCALE, iXsystems wanted to give their users the ability to deploy services alongside their NAS. Coming from an enterprise services perspective, Kubernetes was an obvious option. From their initial GA SCALE release named Angelfish, until the most recent release in 2024, Dragonfish, Kubernetes was the supported container orchestration platform. Throughout the two years, I personally read many support articles and blog posts with the single complaint that SCALE did not support Docker natively. ixSystems apparently heard the complains and have decided to "pivot". 

As of their next release, Electric Eel, iXsystems will no longer support Kubernetes for their containerization service. In my opinion, this is a welcome change. However, an entire ecosystem was created around Kubernetes supported TrueNAS SCALE apps. The most notable was the [Truecharts](https://truecharts.org/) organization. Truecharts builds and maintains a large list of opinionated Helm charts that make spinning up pods quickly a breeze, particularly via the SCALE GUI. Many casual users of SCALE took advantage of the broad catalog of applications. But with the release of Electric Eel, the rug has been pulled on those not using "Official" TrueNAS Applications. iXsystems will thankfully provide an automatic transition to the new containerization service: Docker.



## Truecharts Response
Truecharts received the news of Kubernetes deprecation along with the rest of the community. While they have a "path forward", it [won't include TrueNAS SCALE](https://truecharts.org/news/scale-deprecation/). Rather, they will recommend a Linux distribution called Talos. Read more [here](https://truecharts.org/news/clustertool-update/). 


## My Setup
I currently run a home server with an i5-6600 processor, 32GB DDR4 RAM, 2x 256GB NVME SSD for mirrored boot drives, and 3x 8TB HDDs in a ZFS Pool. If it isn't obvious by now, this is running TrueNAS SCALE on bare metal. I run exclusively Truecharts apps for many use-cases: NextCloud, Tailscale, Media Management Applications, Plex, uptime-kuma, and Kavita. This means that I am among the individuals forced to transition my applications to official TrueNas Apps, or else. . .

## Proof of Concept
Electric Eel won't be released for GA until late October 2024, but I wanted to get a head start - summers are busy!

Effectively, my plan is to:

1. Backup and/or store application configurations from Truecharts applications.

2. Screenshot or document the Truechart's application configuration, as there is not an automated way to do this.

3. Start a new version of the application from TrueNAS SCALE's official release, mirroring as much as possible from Truecharts.

4. Verify that directories can be mounted and resources accessed.

Except there are some additional complications.

### Mounted Directories

iXsystems, in an attempt to safety belt users, added checks to prevent mapping host path directories. This means there's two options. The first is to place all data into a system managed dataset. The second is to mount a network SMB share. 

While SMB is not the ideal path, this is the one I found to be the most straight-forward.

### VPN
All of the Truecharts applications leveraged a Gluetun add-in that allowed application traffic going over the internet to use a VPN provider. The TrueNAS SCALE applications don't currently have any configuration for VPN. I'm hopeful that the Docker implementation will allow for creating Docker stacks, so I can combine my current services with an additional VPN container.

## Whats Next?
While I'm optimistic about Electric Eel's release, and the implementation of Docker, the lack of migration support for Truecharts applications from iXsystems is somewhat frustrating. It seems like iXsystems shouldn't have opened the gate to third party app providers unless they were confident in their implementation of Kubernetes. I'm taking this as a learning experience in leveraging third-party plugins to any ecosystem. While helpful in the short term, they shouldn't be depended upon unless SLAs are communicated.


[^1] See https://www.ixsystems.com/history/ for a comprehensive history of ixSystems
