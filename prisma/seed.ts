import 'dotenv/config';
import { PrismaClient, Month, PackageType, SeasonType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import crypto from 'crypto';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const imagesData: any[] = [
  {
    "id": "cmrnbo4py000bkjzgi6e977ao",
    "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2070&auto=format&fit=crop",
    "altText": "Person Avatar",
    "createdAt": "2026-07-16T09:44:16.870Z",
    "updatedAt": "2026-07-16T09:44:16.870Z"
  },
  {
    "id": "cmrngfo6f00000mf0q1r94ew6",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784203058935-7b101e5ff361f6bba068ba331af8d5c949763227.jpg",
    "altText": "7b101e5ff361f6bba068ba331af8d5c949763227.jpg",
    "createdAt": "2026-07-16T11:57:40.264Z",
    "updatedAt": "2026-07-16T11:57:40.264Z"
  },
  {
    "id": "cmrngg7l900020mf0to5d2ym0",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784203085202-348b79ec629658e85004878cbc348b62558ef945.png",
    "altText": "348b79ec629658e85004878cbc348b62558ef945.png",
    "createdAt": "2026-07-16T11:58:05.421Z",
    "updatedAt": "2026-07-16T11:58:05.421Z"
  },
  {
    "id": "cmrnemcm00025tbzgf3x5k11i",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200011319-TAJ.png",
    "altText": "TAJ.png",
    "createdAt": "2026-07-16T11:06:52.632Z",
    "updatedAt": "2026-07-16T11:06:52.632Z"
  },
  {
    "id": "cmrnbo4pf0009kjzg96tfc2zi",
    "url": "https://images.unsplash.com/photo-1533050487297-09b45013190a?q=80&w=2070&auto=format&fit=crop",
    "altText": "Footer Art",
    "createdAt": "2026-07-16T09:44:16.851Z",
    "updatedAt": "2026-07-16T09:44:16.851Z"
  },
  {
    "id": "cmrnbo5kh00c4kjzgpy4ccwhu",
    "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    "altText": "Goa Wellness Beach",
    "createdAt": "2026-07-16T09:44:17.969Z",
    "updatedAt": "2026-07-16T09:44:17.969Z"
  },
  {
    "id": "cmrnbo5hg009ekjzg0l4tiyu9",
    "url": "https://images.unsplash.com/photo-1600100650505-1cb66042459b?q=80&w=2070&auto=format&fit=crop",
    "altText": "Bandhavgarh Landscape",
    "createdAt": "2026-07-16T09:44:17.860Z",
    "updatedAt": "2026-07-16T09:44:17.860Z"
  },
  {
    "id": "cmrnbo5hi009fkjzgj6enzw9u",
    "url": "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?q=80&w=2070&auto=format&fit=crop",
    "altText": "Kaziranga Rhino",
    "createdAt": "2026-07-16T09:44:17.862Z",
    "updatedAt": "2026-07-16T09:44:17.862Z"
  },
  {
    "id": "cmrnbo5ka00c0kjzgdcy9z75k",
    "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop",
    "altText": "Kerala Wellness Shirodhara",
    "createdAt": "2026-07-16T09:44:17.962Z",
    "updatedAt": "2026-07-16T09:44:17.962Z"
  },
  {
    "id": "cmrnbo5kb00c1kjzgn1pamdkt",
    "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
    "altText": "Rishikesh Yoga Meditation",
    "createdAt": "2026-07-16T09:44:17.963Z",
    "updatedAt": "2026-07-16T09:44:17.963Z"
  },
  {
    "id": "cmrnbo5kd00c2kjzge6621qv7",
    "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
    "altText": "Coimbatore Naturopathy",
    "createdAt": "2026-07-16T09:44:17.965Z",
    "updatedAt": "2026-07-16T09:44:17.965Z"
  },
  {
    "id": "cmrnbo5f30070kjzgr9r5vv4d",
    "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    "altText": "Kanyakumari Sunset",
    "createdAt": "2026-07-16T09:44:17.775Z",
    "updatedAt": "2026-07-16T09:44:17.775Z"
  },
  {
    "id": "cmrnbo5f50071kjzg2uha31vr",
    "url": "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    "altText": "Yelagiri Hills",
    "createdAt": "2026-07-16T09:44:17.777Z",
    "updatedAt": "2026-07-16T09:44:17.777Z"
  },
  {
    "id": "cmrnbo4o30004kjzg869j8am6",
    "url": "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    "altText": "Delhi",
    "createdAt": "2026-07-16T09:44:16.803Z",
    "updatedAt": "2026-07-16T09:44:16.803Z"
  },
  {
    "id": "cmrnbo4od0005kjzg6x9t2yas",
    "url": "https://images.unsplash.com/photo-1564507592205-c5520c427fa8?q=80&w=2070&auto=format&fit=crop",
    "altText": "Agra",
    "createdAt": "2026-07-16T09:44:16.813Z",
    "updatedAt": "2026-07-16T09:44:16.813Z"
  },
  {
    "id": "cmrnbo4nb0001kjzg30b1xl2a",
    "url": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop",
    "altText": "Taj Mahal Cover",
    "createdAt": "2026-07-16T09:44:16.776Z",
    "updatedAt": "2026-07-16T09:44:16.776Z"
  },
  {
    "id": "cmrnbo4ow0007kjzggbmfw1e1",
    "url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop",
    "altText": "Experience 1",
    "createdAt": "2026-07-16T09:44:16.832Z",
    "updatedAt": "2026-07-16T09:44:16.832Z"
  },
  {
    "id": "cmrnbo4on0006kjzg93dj0fq2",
    "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "altText": "Luxury Hotel",
    "createdAt": "2026-07-16T09:44:16.823Z",
    "updatedAt": "2026-07-16T09:44:16.823Z"
  },
  {
    "id": "cmrnbo4qg000dkjzgdp515j2j",
    "url": "https://cdn-icons-png.flaticon.com/512/3229/3229986.png",
    "altText": "Clothes Icon",
    "createdAt": "2026-07-16T09:44:16.888Z",
    "updatedAt": "2026-07-16T09:44:16.888Z"
  },
  {
    "id": "cmrnbo4pp000akjzgallpdirl",
    "url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2070&auto=format&fit=crop",
    "altText": "Indian Food",
    "createdAt": "2026-07-16T09:44:16.861Z",
    "updatedAt": "2026-07-16T09:44:16.861Z"
  },
  {
    "id": "cmrnbo4qp000ekjzg1z0a9gok",
    "url": "https://cdn-icons-png.flaticon.com/512/2814/2814321.png",
    "altText": "Spice Icon",
    "createdAt": "2026-07-16T09:44:16.897Z",
    "updatedAt": "2026-07-16T09:44:16.897Z"
  },
  {
    "id": "cmrnbo519002dkjzgnbmw6lso",
    "url": "https://images.unsplash.com/photo-1600100650505-1cb66042459b?q=80&w=2070&auto=format&fit=crop",
    "altText": "Karnataka Cover",
    "createdAt": "2026-07-16T09:44:17.277Z",
    "updatedAt": "2026-07-16T09:44:17.277Z"
  },
  {
    "id": "cmrnbo510002ckjzglbuptg7e",
    "url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop",
    "altText": "Lakshadweep Cover",
    "createdAt": "2026-07-16T09:44:17.268Z",
    "updatedAt": "2026-07-16T09:44:17.268Z"
  },
  {
    "id": "cmrnbo58r004jkjzgabe5srbs",
    "url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2070&auto=format&fit=crop",
    "altText": "Mumbai Gateway",
    "createdAt": "2026-07-16T09:44:17.547Z",
    "updatedAt": "2026-07-16T09:44:17.547Z"
  },
  {
    "id": "cmrnbo590004kkjzgd45621or",
    "url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070&auto=format&fit=crop",
    "altText": "Jaipur Palace",
    "createdAt": "2026-07-16T09:44:17.556Z",
    "updatedAt": "2026-07-16T09:44:17.556Z"
  },
  {
    "id": "cmrnbo5ew006xkjzga7j7zb7g",
    "url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop",
    "altText": "Rameswaram Temple",
    "createdAt": "2026-07-16T09:44:17.768Z",
    "updatedAt": "2026-07-16T09:44:17.768Z"
  },
  {
    "id": "cmrnbo5ey006ykjzgiib7judz",
    "url": "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
    "altText": "Ooty Tea Estate",
    "createdAt": "2026-07-16T09:44:17.770Z",
    "updatedAt": "2026-07-16T09:44:17.770Z"
  },
  {
    "id": "cmrnbo5f0006zkjzgbcrcvnod",
    "url": "https://images.unsplash.com/photo-1600100650505-1cb66042459b?q=80&w=2070&auto=format&fit=crop",
    "altText": "Chettinad Mansion",
    "createdAt": "2026-07-16T09:44:17.772Z",
    "updatedAt": "2026-07-16T09:44:17.772Z"
  },
  {
    "id": "cmrnbo5ha009bkjzg57jyrzh6",
    "url": "https://images.unsplash.com/photo-1615959189197-48400dc26426?q=80&w=2070&auto=format&fit=crop",
    "altText": "Ranthambore Tiger",
    "createdAt": "2026-07-16T09:44:17.854Z",
    "updatedAt": "2026-07-16T09:44:17.854Z"
  },
  {
    "id": "cmrnbo5hc009ckjzg2g494nmu",
    "url": "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?q=80&w=2070&auto=format&fit=crop",
    "altText": "Jim Corbett Deer",
    "createdAt": "2026-07-16T09:44:17.856Z",
    "updatedAt": "2026-07-16T09:44:17.856Z"
  },
  {
    "id": "cmrnbo5he009dkjzgsm053wzg",
    "url": "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=2070&auto=format&fit=crop",
    "altText": "Kanha Barasingha",
    "createdAt": "2026-07-16T09:44:17.858Z",
    "updatedAt": "2026-07-16T09:44:17.858Z"
  },
  {
    "id": "cmrnfx7um0083tbzgd846dkkq",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784202199141-abovefooter.png",
    "altText": "abovefooter.png",
    "createdAt": "2026-07-16T11:43:19.294Z",
    "updatedAt": "2026-07-16T11:43:19.294Z"
  },
  {
    "id": "cmrnf0zac002xtbzgy97t56ed",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200695026-thag.png",
    "altText": "thag.png",
    "createdAt": "2026-07-16T11:18:15.204Z",
    "updatedAt": "2026-07-16T11:18:15.204Z"
  },
  {
    "id": "cmrnbo4nl0002kjzgtl1g8icj",
    "url": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2070&auto=format&fit=crop",
    "altText": "India Banner",
    "createdAt": "2026-07-16T09:44:16.785Z",
    "updatedAt": "2026-07-16T09:44:16.785Z"
  },
  {
    "id": "cmrney81x0029tbzgbtw78dh4",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200566504-db7b3b23e38baf651334420e806e31b047ee028e.png",
    "altText": "db7b3b23e38baf651334420e806e31b047ee028e.png",
    "createdAt": "2026-07-16T11:16:06.597Z",
    "updatedAt": "2026-07-16T11:16:06.597Z"
  },
  {
    "id": "cmrney5xm0028tbzg7x08qygi",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200563750-db7b3b23e38baf651334420e806e31b047ee028e.png",
    "altText": "db7b3b23e38baf651334420e806e31b047ee028e.png",
    "createdAt": "2026-07-16T11:16:03.850Z",
    "updatedAt": "2026-07-16T11:16:03.850Z"
  },
  {
    "id": "cmrney2a10027tbzgqy4f96nv",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200558943-db7b3b23e38baf651334420e806e31b047ee028e.png",
    "altText": "db7b3b23e38baf651334420e806e31b047ee028e.png",
    "createdAt": "2026-07-16T11:15:59.113Z",
    "updatedAt": "2026-07-16T11:15:59.113Z"
  },
  {
    "id": "cmrneyg7c002ctbzg6r8omfzk",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200576877-db7b3b23e38baf651334420e806e31b047ee028e.png",
    "altText": "db7b3b23e38baf651334420e806e31b047ee028e.png",
    "createdAt": "2026-07-16T11:16:17.160Z",
    "updatedAt": "2026-07-16T11:16:17.160Z"
  },
  {
    "id": "cmrneydfz002btbzgkl17h6xa",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200573499-db7b3b23e38baf651334420e806e31b047ee028e.png",
    "altText": "db7b3b23e38baf651334420e806e31b047ee028e.png",
    "createdAt": "2026-07-16T11:16:13.583Z",
    "updatedAt": "2026-07-16T11:16:13.583Z"
  },
  {
    "id": "cmrneyaao002atbzghg7cjppo",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200569411-db7b3b23e38baf651334420e806e31b047ee028e.png",
    "altText": "db7b3b23e38baf651334420e806e31b047ee028e.png",
    "createdAt": "2026-07-16T11:16:09.504Z",
    "updatedAt": "2026-07-16T11:16:09.504Z"
  },
  {
    "id": "cmrnf75iv0042tbzg7z7g3tmr",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200983090-Varanasighatseveningaartiriverlampsgoldenlightphotography.png",
    "altText": "Varanasi ghats evening aarti river lamps, golden light photography.png",
    "createdAt": "2026-07-16T11:23:03.223Z",
    "updatedAt": "2026-07-16T11:23:03.223Z"
  },
  {
    "id": "cmrnf7yfl0043tbzgesbtioa9",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201020635-Container.png",
    "altText": "Container.png",
    "createdAt": "2026-07-16T11:23:40.689Z",
    "updatedAt": "2026-07-16T11:23:40.689Z"
  },
  {
    "id": "cmrnf8d6z0044tbzgaxb8utji",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201039740-Container1.png",
    "altText": "Container (1).png",
    "createdAt": "2026-07-16T11:23:59.819Z",
    "updatedAt": "2026-07-16T11:23:59.819Z"
  },
  {
    "id": "cmrnf8z170045tbzgd5ubsjhn",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201068078-Varanasighatseveningaartiriverlampsgoldenlightphotography2.png",
    "altText": "Varanasi ghats evening aarti river lamps, golden light photography (2).png",
    "createdAt": "2026-07-16T11:24:28.123Z",
    "updatedAt": "2026-07-16T11:24:28.123Z"
  },
  {
    "id": "cmrnf95xw0046tbzgzkrq2cxc",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201077030-Varanasighatseveningaartiriverlampsgoldenlightphotography3.png",
    "altText": "Varanasi ghats evening aarti river lamps, golden light photography (3).png",
    "createdAt": "2026-07-16T11:24:37.076Z",
    "updatedAt": "2026-07-16T11:24:37.076Z"
  },
  {
    "id": "cmrnfbbiz004utbzgo7eytr7c",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201177290-Rectangle3887.png",
    "altText": "Rectangle 3887.png",
    "createdAt": "2026-07-16T11:26:17.627Z",
    "updatedAt": "2026-07-16T11:26:17.627Z"
  },
  {
    "id": "cmrnfbelk004vtbzglg9jjt65",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201181390-Rectangle38871.png",
    "altText": "Rectangle 3887 (1).png",
    "createdAt": "2026-07-16T11:26:21.608Z",
    "updatedAt": "2026-07-16T11:26:21.608Z"
  },
  {
    "id": "cmrnfblyo004wtbzgj6sn2w50",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201190960-Rectangle38872.png",
    "altText": "Rectangle 3887 (2).png",
    "createdAt": "2026-07-16T11:26:31.152Z",
    "updatedAt": "2026-07-16T11:26:31.152Z"
  },
  {
    "id": "cmrnfbp42004xtbzgs03fb0t3",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201195045-Rectangle38873.png",
    "altText": "Rectangle 3887 (3).png",
    "createdAt": "2026-07-16T11:26:35.234Z",
    "updatedAt": "2026-07-16T11:26:35.234Z"
  },
  {
    "id": "cmrnbo4q7000ckjzgsrxf8egv",
    "url": "https://cdn-icons-png.flaticon.com/512/1051/1051381.png",
    "altText": "Passport Icon",
    "createdAt": "2026-07-16T09:44:16.879Z",
    "updatedAt": "2026-07-16T09:44:16.879Z"
  },
  {
    "id": "cmrnbo4tb000nkjzgg6dy81iy",
    "url": "/IMAGE/Perfect%20For/Photography%20Enthusiasts.png",
    "altText": "Photography Enthusiasts Icon",
    "createdAt": "2026-07-16T09:44:16.991Z",
    "updatedAt": "2026-07-16T09:44:16.991Z"
  },
  {
    "id": "cmrnbo4t1000mkjzgss4ni97k",
    "url": "/IMAGE/Perfect%20For/Luxury%20Travellers.png",
    "altText": "Luxury Travellers Icon",
    "createdAt": "2026-07-16T09:44:16.981Z",
    "updatedAt": "2026-07-16T09:44:16.981Z"
  },
  {
    "id": "cmrnbo4sr000lkjzgbj8zmik1",
    "url": "/IMAGE/Perfect%20For/First-time%20Visitors.png",
    "altText": "First-time Visitors Icon",
    "createdAt": "2026-07-16T09:44:16.971Z",
    "updatedAt": "2026-07-16T09:44:16.971Z"
  },
  {
    "id": "cmrnbo4rz000ikjzggt6i23ex",
    "url": "/IMAGE/Perfect%20For/Couples.png",
    "altText": "Couples Icon",
    "createdAt": "2026-07-16T09:44:16.943Z",
    "updatedAt": "2026-07-16T09:44:16.943Z"
  },
  {
    "id": "cmrnbo4s8000jkjzgp1eio6yr",
    "url": "/IMAGE/Perfect%20For/Culture%20Lovers.png",
    "altText": "Culture Lovers Icon",
    "createdAt": "2026-07-16T09:44:16.952Z",
    "updatedAt": "2026-07-16T09:44:16.952Z"
  },
  {
    "id": "cmrnfn9ay006ctbzgio4drble",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201734351-food1.png",
    "altText": "food1.png",
    "createdAt": "2026-07-16T11:35:34.619Z",
    "updatedAt": "2026-07-16T11:35:34.619Z"
  },
  {
    "id": "cmrnfngqo006dtbzgwrb1ubnx",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201744142-food2.png",
    "altText": "food2.png",
    "createdAt": "2026-07-16T11:35:44.256Z",
    "updatedAt": "2026-07-16T11:35:44.256Z"
  },
  {
    "id": "cmrnfnlez006etbzg445hn25m",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784201750204-food3.png",
    "altText": "food3.png",
    "createdAt": "2026-07-16T11:35:50.315Z",
    "updatedAt": "2026-07-16T11:35:50.315Z"
  },
  {
    "id": "cmrnbo4si000kkjzgz2jsp4ow",
    "url": "/IMAGE/Perfect%20For/Families.png",
    "altText": "Families Icon",
    "createdAt": "2026-07-16T09:44:16.962Z",
    "updatedAt": "2026-07-16T09:44:16.962Z"
  },
  {
    "id": "cmrnbo59b004lkjzg00xd8v0c",
    "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    "altText": "Goa Sunset Beach",
    "createdAt": "2026-07-16T09:44:17.567Z",
    "updatedAt": "2026-07-16T09:44:17.567Z"
  },
  {
    "id": "cmrnbo59k004mkjzgumwycl4a",
    "url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    "altText": "Goa Palms",
    "createdAt": "2026-07-16T09:44:17.576Z",
    "updatedAt": "2026-07-16T09:44:17.576Z"
  },
  {
    "id": "cmrnbo59u004nkjzgo6oyiajn",
    "url": "https://images.unsplash.com/photo-1614082242765-7c98cd0f3df3?q=80&w=2070&auto=format&fit=crop",
    "altText": "Fort Aguada North Goa",
    "createdAt": "2026-07-16T09:44:17.586Z",
    "updatedAt": "2026-07-16T09:44:17.586Z"
  },
  {
    "id": "cmrnbo5a4004okjzgpaxuoyq5",
    "url": "https://images.unsplash.com/photo-1587922449443-77a5247b693b?q=80&w=2069&auto=format&fit=crop",
    "altText": "Basilica of Bom Jesus South Goa",
    "createdAt": "2026-07-16T09:44:17.596Z",
    "updatedAt": "2026-07-16T09:44:17.596Z"
  },
  {
    "id": "cmrnbo5b6004skjzge6txnzj3",
    "url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    "altText": "ITC Grand Goa",
    "createdAt": "2026-07-16T09:44:17.634Z",
    "updatedAt": "2026-07-16T09:44:17.634Z"
  },
  {
    "id": "cmrnbo5bf004tkjzglttp2our",
    "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "altText": "The St. Regis Goa",
    "createdAt": "2026-07-16T09:44:17.643Z",
    "updatedAt": "2026-07-16T09:44:17.643Z"
  },
  {
    "id": "cmrnbo5bn004ukjzgtco49z2a",
    "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2070&auto=format&fit=crop",
    "altText": "W Goa",
    "createdAt": "2026-07-16T09:44:17.651Z",
    "updatedAt": "2026-07-16T09:44:17.651Z"
  },
  {
    "id": "cmrnbo5ck004vkjzgdle8wl8l",
    "url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    "altText": "Grand Hyatt Goa",
    "createdAt": "2026-07-16T09:44:17.684Z",
    "updatedAt": "2026-07-16T09:44:17.684Z"
  },
  {
    "id": "cmrnbo5ad004pkjzgtiof4p4c",
    "url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2070&auto=format&fit=crop",
    "altText": "Goan Fish Curry",
    "createdAt": "2026-07-16T09:44:17.605Z",
    "updatedAt": "2026-07-16T09:44:17.605Z"
  },
  {
    "id": "cmrnbo5an004qkjzg4uy1zlyr",
    "url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2070&auto=format&fit=crop",
    "altText": "Goan Xacuti & Vindaloo",
    "createdAt": "2026-07-16T09:44:17.615Z",
    "updatedAt": "2026-07-16T09:44:17.615Z"
  },
  {
    "id": "cmrnbo5aw004rkjzgvhtk5pbo",
    "url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop",
    "altText": "Goan Sausages & Tandoori",
    "createdAt": "2026-07-16T09:44:17.624Z",
    "updatedAt": "2026-07-16T09:44:17.624Z"
  },
  {
    "id": "cmrnbo51j002ekjzgml5n5jed",
    "url": "https://images.unsplash.com/photo-1593693411515-c202e974fe08?q=80&w=2069&auto=format&fit=crop",
    "altText": "Kerala Backwaters Houseboat",
    "createdAt": "2026-07-16T09:44:17.287Z",
    "updatedAt": "2026-07-16T09:44:17.287Z"
  },
  {
    "id": "cmrnbo51t002fkjzgljrxs29w",
    "url": "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
    "altText": "Munnar Tea Gardens",
    "createdAt": "2026-07-16T09:44:17.297Z",
    "updatedAt": "2026-07-16T09:44:17.297Z"
  },
  {
    "id": "cmrnbo524002gkjzgu9sdac6z",
    "url": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2069&auto=format&fit=crop",
    "altText": "Fort Kochi Chinese Fishing Nets",
    "createdAt": "2026-07-16T09:44:17.308Z",
    "updatedAt": "2026-07-16T09:44:17.308Z"
  },
  {
    "id": "cmrnbo52e002hkjzg2xoy9hth",
    "url": "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    "altText": "Periyar Wildlife Sanctuary",
    "createdAt": "2026-07-16T09:44:17.318Z",
    "updatedAt": "2026-07-16T09:44:17.318Z"
  },
  {
    "id": "cmrnbo4nu0003kjzgzzfpkfxz",
    "url": "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?q=80&w=2070&auto=format&fit=crop",
    "altText": "Sri Lanka Cover",
    "createdAt": "2026-07-16T09:44:16.794Z",
    "updatedAt": "2026-07-16T09:44:16.794Z"
  },
  {
    "id": "cmrnbo53i002lkjzgqmydcc9p",
    "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "altText": "Taj Malabar",
    "createdAt": "2026-07-16T09:44:17.358Z",
    "updatedAt": "2026-07-16T09:44:17.358Z"
  },
  {
    "id": "cmrnbo53s002mkjzgxkc1y119",
    "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2070&auto=format&fit=crop",
    "altText": "The Leela Kovalam",
    "createdAt": "2026-07-16T09:44:17.368Z",
    "updatedAt": "2026-07-16T09:44:17.368Z"
  },
  {
    "id": "cmrnbo542002nkjzgvuf7kabp",
    "url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    "altText": "Brunton Boatyard",
    "createdAt": "2026-07-16T09:44:17.378Z",
    "updatedAt": "2026-07-16T09:44:17.378Z"
  },
  {
    "id": "cmrnbo54c002okjzg7wrj5pfk",
    "url": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop",
    "altText": "Spice Village Resort",
    "createdAt": "2026-07-16T09:44:17.388Z",
    "updatedAt": "2026-07-16T09:44:17.388Z"
  },
  {
    "id": "cmrnbo52o002ikjzgfz2yrh7f",
    "url": "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=2070&auto=format&fit=crop",
    "altText": "Appam with Stew",
    "createdAt": "2026-07-16T09:44:17.328Z",
    "updatedAt": "2026-07-16T09:44:17.328Z"
  },
  {
    "id": "cmrnbo52x002jkjzgsl5uc1ti",
    "url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop",
    "altText": "Kerala Sadya",
    "createdAt": "2026-07-16T09:44:17.337Z",
    "updatedAt": "2026-07-16T09:44:17.337Z"
  },
  {
    "id": "cmrnbo537002kkjzg7brd5l89",
    "url": "https://images.unsplash.com/photo-1589302168068-964664d93dc9?q=80&w=2070&auto=format&fit=crop",
    "altText": "Malabar Parotta & Beef Fry",
    "createdAt": "2026-07-16T09:44:17.347Z",
    "updatedAt": "2026-07-16T09:44:17.347Z"
  },
  {
    "id": "cmrnbo5e5006kkjzg79j95q57",
    "url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop",
    "altText": "Madurai Meenakshi Temple",
    "createdAt": "2026-07-16T09:44:17.741Z",
    "updatedAt": "2026-07-16T09:44:17.741Z"
  },
  {
    "id": "cmrnbo5e7006lkjzg1r4z4hs3",
    "url": "https://images.unsplash.com/photo-1600100650505-1cb66042459b?q=80&w=2070&auto=format&fit=crop",
    "altText": "Thanjavur Temple",
    "createdAt": "2026-07-16T09:44:17.743Z",
    "updatedAt": "2026-07-16T09:44:17.743Z"
  },
  {
    "id": "cmrnbo5e9006mkjzg7yjj4bot",
    "url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2069&auto=format&fit=crop",
    "altText": "Chennai Kapaleeshwarar",
    "createdAt": "2026-07-16T09:44:17.745Z",
    "updatedAt": "2026-07-16T09:44:17.745Z"
  },
  {
    "id": "cmrnbo5eb006nkjzgd3vumd12",
    "url": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=2070&auto=format&fit=crop",
    "altText": "Pondicherry French Quarter",
    "createdAt": "2026-07-16T09:44:17.747Z",
    "updatedAt": "2026-07-16T09:44:17.747Z"
  },
  {
    "id": "cmrnbo4p60008kjzglrsc28u7",
    "url": "https://images.unsplash.com/photo-1600100650505-1cb66042459b?q=80&w=2070&auto=format&fit=crop",
    "altText": "Experience 2",
    "createdAt": "2026-07-16T09:44:16.842Z",
    "updatedAt": "2026-07-16T09:44:16.842Z"
  },
  {
    "id": "cmrnbo5ek006rkjzg8c58cz5e",
    "url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop",
    "altText": "Tanjore Thali & Sweets",
    "createdAt": "2026-07-16T09:44:17.756Z",
    "updatedAt": "2026-07-16T09:44:17.756Z"
  },
  {
    "id": "cmrnbo5em006skjzg6c9di5do",
    "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "altText": "Taj Coromandel",
    "createdAt": "2026-07-16T09:44:17.758Z",
    "updatedAt": "2026-07-16T09:44:17.758Z"
  },
  {
    "id": "cmrnbo5eo006tkjzgxuym61rl",
    "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2070&auto=format&fit=crop",
    "altText": "The Banyan Tree Pondicherry",
    "createdAt": "2026-07-16T09:44:17.760Z",
    "updatedAt": "2026-07-16T09:44:17.760Z"
  },
  {
    "id": "cmrnbo5eq006ukjzgwtl0z3at",
    "url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    "altText": "Svatma Thanjavur",
    "createdAt": "2026-07-16T09:44:17.762Z",
    "updatedAt": "2026-07-16T09:44:17.762Z"
  },
  {
    "id": "cmrnbo5es006vkjzg372r19jq",
    "url": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop",
    "altText": "Heritage Madurai",
    "createdAt": "2026-07-16T09:44:17.764Z",
    "updatedAt": "2026-07-16T09:44:17.764Z"
  },
  {
    "id": "cmrnbo5eu006wkjzgjffzsd5t",
    "url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    "altText": "The Tamara Kodai",
    "createdAt": "2026-07-16T09:44:17.766Z",
    "updatedAt": "2026-07-16T09:44:17.766Z"
  },
  {
    "id": "cmrnbo5ee006okjzgm1ev8mob",
    "url": "https://images.unsplash.com/photo-1589302168068-964664d93dc9?q=80&w=2070&auto=format&fit=crop",
    "altText": "Chennai Filter Coffee & Dosa",
    "createdAt": "2026-07-16T09:44:17.750Z",
    "updatedAt": "2026-07-16T09:44:17.750Z"
  },
  {
    "id": "cmrnbo5eg006pkjzgcd1gd7kp",
    "url": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=2070&auto=format&fit=crop",
    "altText": "Madurai Jigarthanda & Kari Dosa",
    "createdAt": "2026-07-16T09:44:17.752Z",
    "updatedAt": "2026-07-16T09:44:17.752Z"
  },
  {
    "id": "cmrnbo5ei006qkjzg14h7ofmn",
    "url": "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=2070&auto=format&fit=crop",
    "altText": "Coimbatore Kongu Nadu Cuisine",
    "createdAt": "2026-07-16T09:44:17.754Z",
    "updatedAt": "2026-07-16T09:44:17.754Z"
  },
  {
    "id": "cmrnbo5hk009gkjzgb5ppmxfd",
    "url": "https://images.unsplash.com/photo-1615959189197-48400dc26426?q=80&w=2070&auto=format&fit=crop",
    "altText": "Wildlife Tiger Safari",
    "createdAt": "2026-07-16T09:44:17.864Z",
    "updatedAt": "2026-07-16T09:44:17.864Z"
  },
  {
    "id": "cmrnbo5hm009hkjzgqqevdcuj",
    "url": "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=2070&auto=format&fit=crop",
    "altText": "Wildlife Elephant",
    "createdAt": "2026-07-16T09:44:17.866Z",
    "updatedAt": "2026-07-16T09:44:17.866Z"
  },
  {
    "id": "cmrnbo5ho009ikjzgmc4n9wms",
    "url": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=2070&auto=format&fit=crop",
    "altText": "Safari Jeep",
    "createdAt": "2026-07-16T09:44:17.868Z",
    "updatedAt": "2026-07-16T09:44:17.868Z"
  },
  {
    "id": "cmrnbo5hy009nkjzghum7vx1s",
    "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "altText": "Jawai Leopard Camp",
    "createdAt": "2026-07-16T09:44:17.878Z",
    "updatedAt": "2026-07-16T09:44:17.878Z"
  },
  {
    "id": "cmrnbo5i0009okjzgzzacegg3",
    "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2070&auto=format&fit=crop",
    "altText": "Oberoi Vanyavilas",
    "createdAt": "2026-07-16T09:44:17.880Z",
    "updatedAt": "2026-07-16T09:44:17.880Z"
  },
  {
    "id": "cmrnbo5i2009pkjzge3wqmn17",
    "url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    "altText": "Aahana Corbett",
    "createdAt": "2026-07-16T09:44:17.882Z",
    "updatedAt": "2026-07-16T09:44:17.882Z"
  },
  {
    "id": "cmrnbo5i4009qkjzgxf2zncoa",
    "url": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop",
    "altText": "Kanha Earth Lodge",
    "createdAt": "2026-07-16T09:44:17.884Z",
    "updatedAt": "2026-07-16T09:44:17.884Z"
  },
  {
    "id": "cmrnbo5i6009rkjzg5wy60s0p",
    "url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    "altText": "Diphlu River Lodge",
    "createdAt": "2026-07-16T09:44:17.886Z",
    "updatedAt": "2026-07-16T09:44:17.886Z"
  },
  {
    "id": "cmrnbo5hq009jkjzgp7pwz4na",
    "url": "https://images.unsplash.com/photo-1589302168068-964664d93dc9?q=80&w=2070&auto=format&fit=crop",
    "altText": "Ranthambore Poha Jalebi",
    "createdAt": "2026-07-16T09:44:17.870Z",
    "updatedAt": "2026-07-16T09:44:17.870Z"
  },
  {
    "id": "cmrnbo5hs009kkjzgapwxqn4z",
    "url": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=2070&auto=format&fit=crop",
    "altText": "Rajasthan Daal Baati",
    "createdAt": "2026-07-16T09:44:17.872Z",
    "updatedAt": "2026-07-16T09:44:17.872Z"
  },
  {
    "id": "cmrnbo5hu009lkjzg5i6gmuh5",
    "url": "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=2070&auto=format&fit=crop",
    "altText": "Kerala Fish Curry",
    "createdAt": "2026-07-16T09:44:17.874Z",
    "updatedAt": "2026-07-16T09:44:17.874Z"
  },
  {
    "id": "cmrnbo5hw009mkjzgpfexnk1p",
    "url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop",
    "altText": "Jungle Picnic Meal",
    "createdAt": "2026-07-16T09:44:17.876Z",
    "updatedAt": "2026-07-16T09:44:17.876Z"
  },
  {
    "id": "cmrnbo5kj00c5kjzg2j2326yc",
    "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop",
    "altText": "Ayurveda Massage Shirodhara",
    "createdAt": "2026-07-16T09:44:17.971Z",
    "updatedAt": "2026-07-16T09:44:17.971Z"
  },
  {
    "id": "cmrnbo5kl00c6kjzgkv2uk3pb",
    "url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
    "altText": "Yoga by the river",
    "createdAt": "2026-07-16T09:44:17.973Z",
    "updatedAt": "2026-07-16T09:44:17.973Z"
  },
  {
    "id": "cmrnbo5kn00c7kjzgtdpgaas4",
    "url": "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2070&auto=format&fit=crop",
    "altText": "Ayurveda Doctor Consultation",
    "createdAt": "2026-07-16T09:44:17.975Z",
    "updatedAt": "2026-07-16T09:44:17.975Z"
  },
  {
    "id": "cmrnbo5kp00c8kjzgolgm2dv5",
    "url": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
    "altText": "Sattvic Balancing Meal",
    "createdAt": "2026-07-16T09:44:17.977Z",
    "updatedAt": "2026-07-16T09:44:17.977Z"
  },
  {
    "id": "cmrnbo5kw00cckjzg7al1hygm",
    "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    "altText": "Somatheeram Ayurveda Resort",
    "createdAt": "2026-07-16T09:44:17.984Z",
    "updatedAt": "2026-07-16T09:44:17.984Z"
  },
  {
    "id": "cmrnbo5l000cdkjzgjmat9qnu",
    "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2070&auto=format&fit=crop",
    "altText": "Carnoustie Ayurveda Resort",
    "createdAt": "2026-07-16T09:44:17.988Z",
    "updatedAt": "2026-07-16T09:44:17.988Z"
  },
  {
    "id": "cmrnbo5l200cekjzglnpf80br",
    "url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    "altText": "Ananda in the Himalayas",
    "createdAt": "2026-07-16T09:44:17.990Z",
    "updatedAt": "2026-07-16T09:44:17.990Z"
  },
  {
    "id": "cmrnbo5l500cfkjzgk970a382",
    "url": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop",
    "altText": "The Dune Eco Village",
    "createdAt": "2026-07-16T09:44:17.993Z",
    "updatedAt": "2026-07-16T09:44:17.993Z"
  },
  {
    "id": "cmrnbo5l700cgkjzg4mp0ex54",
    "url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    "altText": "Jetwing Ayurveda Pavilions",
    "createdAt": "2026-07-16T09:44:17.995Z",
    "updatedAt": "2026-07-16T09:44:17.995Z"
  },
  {
    "id": "cmrnbo5kr00c9kjzghtagp8yw",
    "url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    "altText": "Herbal Detox Drink",
    "createdAt": "2026-07-16T09:44:17.979Z",
    "updatedAt": "2026-07-16T09:44:17.979Z"
  },
  {
    "id": "cmrnbo5ks00cakjzgmmdiwhpw",
    "url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=2070&auto=format&fit=crop",
    "altText": "Traditional Kashayam Tea",
    "createdAt": "2026-07-16T09:44:17.980Z",
    "updatedAt": "2026-07-16T09:44:17.980Z"
  },
  {
    "id": "cmrnbo5ku00cbkjzg4lvvsf0w",
    "url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop",
    "altText": "Organic & Local Ingredients",
    "createdAt": "2026-07-16T09:44:17.982Z",
    "updatedAt": "2026-07-16T09:44:17.982Z"
  },
  {
    "id": "cmrnemkvw0026tbzg3bgzngag",
    "url": "https://webnox.blr1.digitaloceanspaces.com/indiasrilankaescape/1784200022782-SRI.png",
    "altText": "SRI.png",
    "createdAt": "2026-07-16T11:07:03.356Z",
    "updatedAt": "2026-07-16T11:07:03.356Z"
  },
  {
    "id": "cmrnbo5kf00c3kjzgw2y6q8vz",
    "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop",
    "altText": "Sri Lanka Wellness Retreat",
    "createdAt": "2026-07-16T09:44:17.967Z",
    "updatedAt": "2026-07-16T09:44:17.967Z"
  },
  {
    "id": "cmrnbo50r002bkjzgnuaimpgr",
    "url": "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2070&auto=format&fit=crop",
    "altText": "Sri Lanka Extension Cover",
    "createdAt": "2026-07-16T09:44:17.259Z",
    "updatedAt": "2026-07-16T09:44:17.259Z"
  }
];
const iconsData: any[] = [
  {
    "id": "cmrnbo4rf000gkjzgahyshr72",
    "name": "Dress Code",
    "imageId": "cmrnbo4qg000dkjzgdp515j2j",
    "createdAt": "2026-07-16T09:44:16.923Z"
  },
  {
    "id": "cmrnbo4ro000hkjzg3phd6h3y",
    "name": "Spicy Food",
    "imageId": "cmrnbo4qp000ekjzg1z0a9gok",
    "createdAt": "2026-07-16T09:44:16.932Z"
  },
  {
    "id": "cmrnbo4r1000fkjzguke89epp",
    "name": "Passport & Visa",
    "imageId": "cmrnbo4q7000ckjzgsrxf8egv",
    "createdAt": "2026-07-16T09:44:16.909Z"
  },
  {
    "id": "cmrnbo4uy000tkjzgpbh03ot1",
    "name": "Photography Enthusiasts",
    "imageId": "cmrnbo4tb000nkjzgg6dy81iy",
    "createdAt": "2026-07-16T09:44:17.050Z"
  },
  {
    "id": "cmrnbo4uo000skjzg4h1d03ro",
    "name": "Luxury Travellers",
    "imageId": "cmrnbo4t1000mkjzgss4ni97k",
    "createdAt": "2026-07-16T09:44:17.040Z"
  },
  {
    "id": "cmrnbo4ue000rkjzgwgc5c53q",
    "name": "First-time Visitors",
    "imageId": "cmrnbo4sr000lkjzgbj8zmik1",
    "createdAt": "2026-07-16T09:44:17.030Z"
  },
  {
    "id": "cmrnbo4tl000okjzgfn46hsci",
    "name": "Couples",
    "imageId": "cmrnbo4rz000ikjzggt6i23ex",
    "createdAt": "2026-07-16T09:44:17.001Z"
  },
  {
    "id": "cmrnbo4tv000pkjzg6s2yykls",
    "name": "Culture Lovers",
    "imageId": "cmrnbo4s8000jkjzgp1eio6yr",
    "createdAt": "2026-07-16T09:44:17.011Z"
  },
  {
    "id": "cmrnbo4u4000qkjzgp75zen7d",
    "name": "Families",
    "imageId": "cmrnbo4si000kkjzgz2jsp4ow",
    "createdAt": "2026-07-16T09:44:17.020Z"
  }
];
const countriesData: any[] = [
  {
    "id": "cmrnbo4x0000vkjzg41ix8ani",
    "name": "India",
    "title": "THE SUBCONTINENT AWAITS",
    "imageId": "cmrnemcm00025tbzgf3x5k11i",
    "description": "Seven iconic destinations. One extraordinary subcontinent that \nrewrites everything you thought you knew about travel.",
    "primaryColor": null,
    "secondaryColor": null,
    "footerImageId": null,
    "isActive": true,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.124Z",
    "updatedAt": "2026-07-16T11:08:21.059Z"
  },
  {
    "id": "cmrnbo4xh000xkjzgiaksebhx",
    "name": "Sri Lanka",
    "title": "PEARL OF THE INDIAN OCEAN",
    "imageId": "cmrnemkvw0026tbzg3bgzngag",
    "description": "One teardrop island. Ancient kingdoms, leopard safaris, tea highlands, \nand beaches where the ocean glows at dusk",
    "primaryColor": null,
    "secondaryColor": null,
    "footerImageId": null,
    "isActive": true,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.142Z",
    "updatedAt": "2026-07-16T11:08:46.180Z"
  }
];
const packagesData: any[] = [
  {
    "id": "cmrnbo5mp00efkjzgmte9bv8u",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Goa Wellness Extension",
    "subtitle": null,
    "slug": "goa-wellness-extension",
    "description": "Balance your energies with yoga retreats and spa therapies overlooking the sandy beaches of Goa.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Goa Wellness!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.049Z",
    "updatedAt": "2026-07-16T09:44:18.049Z"
  },
  {
    "id": "cmrnbo5jk00blkjzgnqpsmek9",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Bandhavgarh Extension",
    "subtitle": null,
    "slug": "bandhavgarh-extension",
    "description": "Visit the reserve with the highest density of Royal Bengal Tigers in India.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Bandhavgarh!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.936Z",
    "updatedAt": "2026-07-16T09:44:17.936Z"
  },
  {
    "id": "cmrnbo5js00bqkjzg38zdztrf",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Kaziranga Extension",
    "subtitle": null,
    "slug": "kaziranga-extension",
    "description": "Discover the home of the Great Indian One-Horned Rhinoceros on the banks of Brahmaputra.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Kaziranga!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.944Z",
    "updatedAt": "2026-07-16T09:44:17.944Z"
  },
  {
    "id": "cmrnbo5lv00dvkjzg1u1iee6n",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Kerala Wellness Extension",
    "subtitle": null,
    "slug": "kerala-wellness-extension",
    "description": "Relax at the Ayurveda capital of India with traditional backwater views and authentic treatments.",
    "durationDays": 4,
    "durationNights": 3,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Kerala Wellness!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.019Z",
    "updatedAt": "2026-07-16T09:44:18.019Z"
  },
  {
    "id": "cmrnbo5m300e0kjzg1qfenj22",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Rishikesh Wellness Extension",
    "subtitle": null,
    "slug": "rishikesh-wellness-extension",
    "description": "Engage in rejuvenating yoga and meditation retreats along the banks of the sacred Ganges.",
    "durationDays": 4,
    "durationNights": 3,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Rishikesh Wellness!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.027Z",
    "updatedAt": "2026-07-16T09:44:18.027Z"
  },
  {
    "id": "cmrnbo5ma00e5kjzg99cf7ygg",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Coimbatore Wellness Extension",
    "subtitle": null,
    "slug": "coimbatore-wellness-extension",
    "description": "Experience deep healing through nature and naturopathy at the foothills of Western Ghats.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Coimbatore Wellness!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.034Z",
    "updatedAt": "2026-07-16T09:44:18.034Z"
  },
  {
    "id": "cmrnbo5gm008wkjzg2pfdf59b",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Kanyakumari Extension",
    "subtitle": null,
    "slug": "kanyakumari-extension",
    "description": "Visit the Southernmost tip of India, Vivekananda Rock Memorial, and witness unique sunrise and sunset views.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Kanyakumari!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.830Z",
    "updatedAt": "2026-07-16T09:44:17.830Z"
  },
  {
    "id": "cmrnbo5gt0091kjzgzhvaoaog",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Yelagiri Extension",
    "subtitle": null,
    "slug": "yelagiri-extension",
    "description": "Relax in the quiet, offbeat hill station of Yelagiri with green valleys and orchards.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Yelagiri!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.837Z",
    "updatedAt": "2026-07-16T09:44:17.837Z"
  },
  {
    "id": "cmrnbo4zf001vkjzgbws5ei1k",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Goa Beach Extension",
    "subtitle": null,
    "slug": "goa-extension",
    "description": "Relax on the pristine beaches of Goa after your cultural tour.",
    "durationDays": 4,
    "durationNights": 3,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend your trip to the coast!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.211Z",
    "updatedAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrnbo55v0040kjzg6g258t6l",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Karnataka Extension",
    "subtitle": null,
    "slug": "karnataka-extension",
    "description": "Explore the royal palaces of Mysore and ancient ruins of Hampi.",
    "durationDays": 4,
    "durationNights": 3,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Karnataka!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.443Z",
    "updatedAt": "2026-07-16T09:44:17.443Z"
  },
  {
    "id": "cmrnbo56j0045kjzg9rrmtqdk",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Lakshadweep Extension",
    "subtitle": null,
    "slug": "lakshadweep-extension",
    "description": "Unwind on the secluded white sands and vibrant coral reefs of Lakshadweep islands.",
    "durationDays": 4,
    "durationNights": 3,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Lakshadweep!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.467Z",
    "updatedAt": "2026-07-16T09:44:17.467Z"
  },
  {
    "id": "cmrnbo5df0066kjzg8r2yepbs",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Mumbai Extension",
    "subtitle": null,
    "slug": "mumbai-extension",
    "description": "Explore the gateway of India, Bollywood tours, and vibrant marine drive promenade.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Mumbai!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.715Z",
    "updatedAt": "2026-07-16T09:44:17.715Z"
  },
  {
    "id": "cmrnbo5dp006bkjzgg6rt31tm",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Rajasthan Extension",
    "subtitle": null,
    "slug": "rajasthan-extension",
    "description": "Journey to the royal cities of Jaipur, Udaipur, and Jodhpur to experience grand palaces and forts.",
    "durationDays": 5,
    "durationNights": 4,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Rajasthan!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.725Z",
    "updatedAt": "2026-07-16T09:44:17.725Z"
  },
  {
    "id": "cmrnbo5fx008hkjzglc5ug5o3",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Rameswaram Extension",
    "subtitle": null,
    "slug": "rameswaram-extension",
    "description": "Visit the sacred Ramanathaswamy Temple and see the scenic Pamban Bridge.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Rameswaram!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.805Z",
    "updatedAt": "2026-07-16T09:44:17.805Z"
  },
  {
    "id": "cmrnbo5g4008mkjzgp8ybcsae",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Ooty Extension",
    "subtitle": null,
    "slug": "ooty-extension",
    "description": "Explore the Queen of Hill Stations, scenic tea estates, and ride the historic Nilgiri toy train.",
    "durationDays": 4,
    "durationNights": 3,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Ooty!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.812Z",
    "updatedAt": "2026-07-16T09:44:17.812Z"
  },
  {
    "id": "cmrnbo5gc008rkjzgcngsit6s",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Chettinad Extension",
    "subtitle": null,
    "slug": "chettinad-extension",
    "description": "Discover grand mansions, local handloom weaving, and spicy authentic Chettinad cuisine.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Chettinad!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.820Z",
    "updatedAt": "2026-07-16T09:44:17.820Z"
  },
  {
    "id": "cmrnbo5iy00b6kjzgf7fn8eos",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Ranthambore Extension",
    "subtitle": null,
    "slug": "ranthambore-extension",
    "description": "Go on exciting tiger tracking safaris in the legendary Ranthambore reserve.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Ranthambore!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.914Z",
    "updatedAt": "2026-07-16T09:44:17.914Z"
  },
  {
    "id": "cmrnbo5j600bbkjzguj8enrzi",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Jim Corbett Extension",
    "subtitle": null,
    "slug": "jim-corbett-extension",
    "description": "Explore India's oldest national park nestled in the foothills of Himalayas.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Jim Corbett!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.922Z",
    "updatedAt": "2026-07-16T09:44:17.922Z"
  },
  {
    "id": "cmrnbo5jc00bgkjzgndwnbilj",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Kanha Extension",
    "subtitle": null,
    "slug": "kanha-extension",
    "description": "Journey to the dense forests of Kanha, inspiration for The Jungle Book, and spot the rare Barasingha.",
    "durationDays": 3,
    "durationNights": 2,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "INR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Kanha!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.928Z",
    "updatedAt": "2026-07-16T09:44:17.928Z"
  },
  {
    "id": "cmrnbo4yb000ykjzg958bhshg",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Golden Triangle",
    "subtitle": "India's Most Iconic Journey",
    "slug": "golden-triangle",
    "description": "Discover India•s most celebrated circuit connecting three magnificent cities steeped in history. culture and royal heritage. From the timeless beauty of the TajMahal to the vibrant colours Of Jaipur. this journey offers unforgettable experiences at every step.",
    "durationDays": 6,
    "durationNights": 5,
    "bestTimeToTravel": "Oct to Mar",
    "weather": "15C - 30C",
    "travelTime": "Delhi to Agra 3 - 4 hrs",
    "tourDuration": "6 Days / 5 Nights",
    "tourStyle": "Private Chauffeur Tour",
    "type": "MAIN",
    "isActive": true,
    "currency": "INR",
    "primaryColor": "#e1bf41",
    "secondaryColor": null,
    "footerTitle": "Let's plan your escape.",
    "footerImageId": "cmrnfx7um0083tbzgd846dkkq",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.171Z",
    "updatedAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrnbo5cu004wkjzgfznnm4zi",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Goa",
    "subtitle": "Sun, Sand & Serenity",
    "slug": "goa",
    "description": "Experience the perfect blend of pristine beaches, vibrant culture, Portuguese heritage, and world-class hospitality. From thrilling water sports to laid-back beach vibes, Goa is your ultimate tropical getaway.",
    "durationDays": 4,
    "durationNights": 3,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "MAIN",
    "isActive": true,
    "currency": "INR",
    "primaryColor": "#b45309",
    "secondaryColor": "#fef3c7",
    "footerTitle": "Let's plan your escape.",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.694Z",
    "updatedAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo54z002pkjzgpw3dp8dt",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Kerala",
    "subtitle": "God's Own Country",
    "slug": "kerala",
    "description": "Discover enchanting backwaters, lush hill stations, serene beaches, and rejuvenating Ayurveda wellness. Kerala's natural beauty and warm hospitality make it a truly unforgettable experience.",
    "durationDays": 5,
    "durationNights": 4,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "MAIN",
    "isActive": true,
    "currency": "INR",
    "primaryColor": "#1b4332",
    "secondaryColor": "#d8f3dc",
    "footerTitle": "Let's plan your escape.",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.411Z",
    "updatedAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbo5ff0072kjzgr2uxpv49",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Tamil Nadu",
    "subtitle": "Temples, Traditions & Timeless Heritage",
    "slug": "tamil-nadu",
    "description": "Discover the soul of South India with its magnificent temples, rich traditions, classical arts, serene hill stations and pristine beaches. Tamil Nadu offers a perfect blend of spirituality, culture, history and natural beauty.",
    "durationDays": 6,
    "durationNights": 5,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "MAIN",
    "isActive": true,
    "currency": "INR",
    "primaryColor": "#b45309",
    "secondaryColor": "#fef3c7",
    "footerTitle": "Let's plan your escape.",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.787Z",
    "updatedAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5ig009skjzg9eqsa02x",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Wildlife Experiences",
    "subtitle": "Into the Heart of Nature",
    "slug": "wildlife",
    "description": "Embark on thrilling wildlife safaris and discover India's incredible biodiversity. From majestic tigers and elephants to exotic birds and rare species, every moment brings you closer to nature.",
    "durationDays": 5,
    "durationNights": 4,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "MAIN",
    "isActive": true,
    "currency": "INR",
    "primaryColor": "#3f6212",
    "secondaryColor": "#fefae0",
    "footerTitle": "Let's plan your escape.",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.896Z",
    "updatedAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5lg00chkjzga9n6eqhl",
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "title": "Ayurveda Wellness & Spa Experiences",
    "subtitle": "Rejuvenate. Restore. Rebalance.",
    "slug": "ayurveda-wellness",
    "description": "Discover the ancient healing wisdom of Ayurveda in India and Sri Lanka. Unwind with holistic therapies, detox programs and rejuvenating spa retreats set in serene surroundings.",
    "durationDays": 5,
    "durationNights": 4,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "MAIN",
    "isActive": true,
    "currency": "INR",
    "primaryColor": "#365314",
    "secondaryColor": "#fefae0",
    "footerTitle": "Let's plan your wellness escape.",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:18.004Z",
    "updatedAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5mi00eakjzgkmzblx2j",
    "countryId": "cmrnbo4xh000xkjzgiaksebhx",
    "title": "Sri Lanka Wellness Extension",
    "subtitle": null,
    "slug": "sri-lanka-wellness-extension",
    "description": "Combine coastal relaxation with traditional Hela Vedakama and Ayurvedic healing programs.",
    "durationDays": 4,
    "durationNights": 3,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "LKR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Sri Lanka Wellness!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.042Z",
    "updatedAt": "2026-07-16T09:44:18.042Z"
  },
  {
    "id": "cmrnbo571004akjzg2kkpmrk3",
    "countryId": "cmrnbo4xh000xkjzgiaksebhx",
    "title": "Sri Lanka Extension",
    "subtitle": null,
    "slug": "sri-lanka-extension",
    "description": "Journey across the teardrop of the Indian Ocean to experience wildlife, tea plantations, and beach sunsets.",
    "durationDays": 5,
    "durationNights": 4,
    "bestTimeToTravel": null,
    "weather": null,
    "travelTime": null,
    "tourDuration": null,
    "tourStyle": null,
    "type": "ADDON",
    "isActive": true,
    "currency": "LKR",
    "primaryColor": null,
    "secondaryColor": null,
    "footerTitle": "Extend to Sri Lanka!",
    "footerImageId": "cmrnbo4pf0009kjzg96tfc2zi",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.485Z",
    "updatedAt": "2026-07-16T09:44:17.485Z"
  }
];
const seoMetasData: any[] = [
  {
    "id": "cmrnbo4x1000wkjzg3zva8vs2",
    "title": "Tours to India | Exotic Escapes",
    "description": "Book your dream vacation to India.",
    "keywords": null,
    "countryId": "cmrnbo4x0000vkjzg41ix8ani",
    "packageId": null
  }
];
const itinerariesData: any[] = [
  {
    "id": "cmrnbo5ms00ejkjzgalzdk7gj",
    "packageId": "cmrnbo5mp00efkjzgmte9bv8u",
    "dayNumber": 1,
    "title": "Arrival in Goa",
    "subtitle": "Wellness by the Beach",
    "description": "Arrive and check in to a sea-facing wellness resort.",
    "imageId": "cmrnbo5kh00c4kjzgpy4ccwhu",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.049Z"
  },
  {
    "id": "cmrnbo5jn00bpkjzg3kmlde94",
    "packageId": "cmrnbo5jk00blkjzgnqpsmek9",
    "dayNumber": 1,
    "title": "Arrival in Bandhavgarh",
    "subtitle": "Tiger Peak",
    "description": "Arrive and check in. Early morning tiger tracking.",
    "imageId": "cmrnbo5hg009ekjzg0l4tiyu9",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.936Z"
  },
  {
    "id": "cmrnbo5jw00bukjzgq61qd7jv",
    "packageId": "cmrnbo5js00bqkjzg38zdztrf",
    "dayNumber": 1,
    "title": "Arrival in Kaziranga",
    "subtitle": "Rhino Plains",
    "description": "Arrive and check in. Afternoon elephant-back safari.",
    "imageId": "cmrnbo5hi009fkjzgj6enzw9u",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.944Z"
  },
  {
    "id": "cmrnbo5ly00dzkjzgm6mgtyil",
    "packageId": "cmrnbo5lv00dvkjzg1u1iee6n",
    "dayNumber": 1,
    "title": "Arrival in Kerala",
    "subtitle": "Ayurveda Capital",
    "description": "Arrive and check in to a premium backwater wellness resort.",
    "imageId": "cmrnbo5ka00c0kjzgdcy9z75k",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.019Z"
  },
  {
    "id": "cmrnbo5m600e4kjzgkhte2nsx",
    "packageId": "cmrnbo5m300e0kjzg1qfenj22",
    "dayNumber": 1,
    "title": "Arrival in Rishikesh",
    "subtitle": "Yoga & Meditation",
    "description": "Arrive and transfer to a mountain view retreat.",
    "imageId": "cmrnbo5kb00c1kjzgn1pamdkt",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.027Z"
  },
  {
    "id": "cmrnbo5mc00e9kjzgx79ull6e",
    "packageId": "cmrnbo5ma00e5kjzg99cf7ygg",
    "dayNumber": 1,
    "title": "Arrival in Coimbatore",
    "subtitle": "Nature & Naturopathy",
    "description": "Arrive and check in. Holistic doctor consultation.",
    "imageId": "cmrnbo5kd00c2kjzge6621qv7",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.034Z"
  },
  {
    "id": "cmrnbo5go0090kjzgplwtf1mk",
    "packageId": "cmrnbo5gm008wkjzg2pfdf59b",
    "dayNumber": 1,
    "title": "Arrival in Kanyakumari",
    "subtitle": "Land's End",
    "description": "Arrive and transfer to hotel. Visit Vivekananda Rock Memorial.",
    "imageId": "cmrnbo5f30070kjzgr9r5vv4d",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.830Z"
  },
  {
    "id": "cmrnbo5gw0095kjzguhu992i0",
    "packageId": "cmrnbo5gt0091kjzgzhvaoaog",
    "dayNumber": 1,
    "title": "Arrival in Yelagiri",
    "subtitle": "Offbeat Hills",
    "description": "Arrive and check in. Enjoy boating on Punganoor lake.",
    "imageId": "cmrnbo5f50071kjzg2uha31vr",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.837Z"
  },
  {
    "id": "cmrnbo4zk0023kjzgj2xk68iw",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "dayNumber": 1,
    "title": "Arrival in Goa",
    "subtitle": "Welcome to the beach",
    "description": "Arrive at Goa airport and transfer to your beachfront resort.",
    "imageId": "cmrnbo4o30004kjzg869j8am6",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrnbo4zk0024kjzg1kh5coi2",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "dayNumber": 2,
    "title": "North Goa Beaches",
    "subtitle": "Sun & Sand",
    "description": "Explore Baga, Calangute, and Anjuna beaches.",
    "imageId": "cmrnbo4od0005kjzg6x9t2yas",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrnbo4zk0025kjzghcnrrmkl",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "dayNumber": 3,
    "title": "South Goa Heritage",
    "subtitle": "Churches & Spices",
    "description": "Visit Old Goa churches and a local spice plantation.",
    "imageId": "cmrnbo4nb0001kjzg30b1xl2a",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrnbo4zk0026kjzghv7s18id",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "dayNumber": 4,
    "title": "Departure from Goa",
    "subtitle": "Farewell",
    "description": "Transfer to the airport for your onward journey.",
    "imageId": null,
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrnbo55y0044kjzg08z56ic2",
    "packageId": "cmrnbo55v0040kjzg6g258t6l",
    "dayNumber": 1,
    "title": "Arrival in Bangalore",
    "subtitle": "Silicon Valley",
    "description": "Arrive and transfer to hotel. Explore Bangalore Palace.",
    "imageId": "cmrnbo519002dkjzgnbmw6lso",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.443Z"
  },
  {
    "id": "cmrnbo56m0049kjzgs1fomfzy",
    "packageId": "cmrnbo56j0045kjzg9rrmtqdk",
    "dayNumber": 1,
    "title": "Fly to Agatti",
    "subtitle": "Coral Paradise",
    "description": "Arrive at Agatti airport and transfer to beach resort.",
    "imageId": "cmrnbo510002ckjzglbuptg7e",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.467Z"
  },
  {
    "id": "cmrnbo5di006akjzggh4s9uc0",
    "packageId": "cmrnbo5df0066kjzg8r2yepbs",
    "dayNumber": 1,
    "title": "Arrival in Mumbai",
    "subtitle": "City of Dreams",
    "description": "Arrive and transfer to your hotel. Visit Marine Drive in the evening.",
    "imageId": "cmrnbo58r004jkjzgabe5srbs",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.715Z"
  },
  {
    "id": "cmrnbo5ds006fkjzg1n4rhi1b",
    "packageId": "cmrnbo5dp006bkjzgg6rt31tm",
    "dayNumber": 1,
    "title": "Arrival in Jaipur",
    "subtitle": "Pink City",
    "description": "Arrive and check in. Visit the city palace and local bazaar.",
    "imageId": "cmrnbo590004kkjzgd45621or",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.725Z"
  },
  {
    "id": "cmrnbo5fz008lkjzg07xa22zg",
    "packageId": "cmrnbo5fx008hkjzglc5ug5o3",
    "dayNumber": 1,
    "title": "Arrival in Rameswaram",
    "subtitle": "Spiritual Island",
    "description": "Arrive in Rameswaram, cross the Pamban Bridge, and visit Ramanathaswamy Temple.",
    "imageId": "cmrnbo5ew006xkjzga7j7zb7g",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.805Z"
  },
  {
    "id": "cmrnbo5g7008qkjzglfb3etqt",
    "packageId": "cmrnbo5g4008mkjzgp8ybcsae",
    "dayNumber": 1,
    "title": "Arrival in Ooty",
    "subtitle": "Blue Hills",
    "description": "Arrive and transfer to resort. Enjoy a walk through tea gardens.",
    "imageId": "cmrnbo5ey006ykjzgiib7judz",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.812Z"
  },
  {
    "id": "cmrnbo5gf008vkjzgyezq3dpv",
    "packageId": "cmrnbo5gc008rkjzgcngsit6s",
    "dayNumber": 1,
    "title": "Arrival in Chettinad",
    "subtitle": "Heritage & Mansions",
    "description": "Arrive and check in to a heritage hotel. Visit grand mansions and local tile workshops.",
    "imageId": "cmrnbo5f0006zkjzgbcrcvnod",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.820Z"
  },
  {
    "id": "cmrnbo5j100bakjzgnqjce0bu",
    "packageId": "cmrnbo5iy00b6kjzgf7fn8eos",
    "dayNumber": 1,
    "title": "Arrival in Ranthambore",
    "subtitle": "Tiger Lands",
    "description": "Arrive and check in. Enjoy an evening orientation safari.",
    "imageId": "cmrnbo5ha009bkjzg57jyrzh6",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.914Z"
  },
  {
    "id": "cmrnbo5j900bfkjzgoxt5ieu0",
    "packageId": "cmrnbo5j600bbkjzguj8enrzi",
    "dayNumber": 1,
    "title": "Arrival in Corbett",
    "subtitle": "Oldest Reserve",
    "description": "Arrive and check in. Afternoon jeep safari.",
    "imageId": "cmrnbo5hc009ckjzg2g494nmu",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.922Z"
  },
  {
    "id": "cmrnbo5jf00bkkjzg692ileva",
    "packageId": "cmrnbo5jc00bgkjzgndwnbilj",
    "dayNumber": 1,
    "title": "Arrival in Kanha",
    "subtitle": "Barasingha Sanctuary",
    "description": "Arrive and check in. Explore buffer-zone trails.",
    "imageId": "cmrnbo5he009dkjzgsm053wzg",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.928Z"
  },
  {
    "id": "cmrngshsv00032kf0go0uymyv",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "dayNumber": 3,
    "title": "Drive to Agra",
    "subtitle": null,
    "description": "Morning drive to Agra. Check-in and afternoon visit to the Agra Fort.",
    "imageId": "cmrney81x0029tbzgbtw78dh4",
    "country": "India",
    "state": "Ladakh",
    "city": "Leh",
    "lat": 34.16504,
    "lng": 77.58402,
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshsr00022kf0b68041i0",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "dayNumber": 2,
    "title": "Delhi Sightseeing",
    "subtitle": null,
    "description": "Full day city tour exploring the Red Fort, Jama Masjid, and India Gate.",
    "imageId": "cmrney5xm0028tbzg7x08qygi",
    "country": "India",
    "state": "Uttar Pradesh",
    "city": "Agra",
    "lat": 27.18333,
    "lng": 78.01667,
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshsh00012kf0z9t7y87q",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "dayNumber": 1,
    "title": "Arrival in Delhi",
    "subtitle": null,
    "description": "Arrive at the airport. Our representative will meet and assist you in transferring to your hotel.",
    "imageId": "cmrney2a10027tbzgqy4f96nv",
    "country": "India",
    "state": "Delhi",
    "city": "Delhi",
    "lat": 28.65195,
    "lng": 77.23149,
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngsht500062kf0edg0b6n3",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "dayNumber": 6,
    "title": "Return to Delhi",
    "subtitle": null,
    "description": "Drive back to Delhi for your onward flight.",
    "imageId": "cmrneyg7c002ctbzg6r8omfzk",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngsht100052kf0l4bzhb9w",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "dayNumber": 5,
    "title": "Jaipur Exploration",
    "subtitle": null,
    "description": "Visit Amber Fort, City Palace, and Hawa Mahal.",
    "imageId": "cmrneydfz002btbzgkl17h6xa",
    "country": "India",
    "state": "Goa",
    "city": "Aldona",
    "lat": 15.59337,
    "lng": 73.87482,
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshsy00042kf0dsqeqr8q",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "dayNumber": 4,
    "title": "Taj Mahal & Jaipur",
    "subtitle": null,
    "description": "Early morning visit to the Taj Mahal. Later drive to Jaipur via Fatehpur Sikri.",
    "imageId": "cmrneyaao002atbzghg7cjppo",
    "country": "India",
    "state": "Jammu and Kashmir",
    "city": "Jammu",
    "lat": 32.75,
    "lng": 74.83333,
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrnbo5cz005jkjzgf0l2fkss",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "dayNumber": 1,
    "title": "Arrival in Goa",
    "subtitle": "Welcome to Paradise",
    "description": "Arrive in Goa and transfer to your hotel. Spend the evening at leisure on the beach. Enjoy a sunset by the sea. Overnight stay in Goa.",
    "imageId": "cmrnbo59b004lkjzg00xd8v0c",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5cz005kkjzgcj6oqjt2",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "dayNumber": 2,
    "title": "North Goa Exploration",
    "subtitle": "Beaches & Forts",
    "description": "Explore North Goa - visit Fort Aguada, Anjuna Beach, Vagator Beach and the famous Chapora Fort. Experience the vibrant nightlife. Overnight stay in Goa.",
    "imageId": "cmrnbo59u004nkjzgo6oyiajn",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5cz005lkjzguw26v1zn",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "dayNumber": 3,
    "title": "South Goa & Heritage",
    "subtitle": "Churches & Culture",
    "description": "Visit Basilica of Bom Jesus, Se Cathedral, and Old Goa Church. Relax at Palolem or Colva Beach. Enjoy water sports or a spice plantation visit. Overnight stay in Goa.",
    "imageId": "cmrnbo5a4004okjzgpaxuoyq5",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5cz005mkjzgoe03e69t",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "dayNumber": 4,
    "title": "Departure",
    "subtitle": "Farewell Goa",
    "description": "After breakfast, enjoy some leisure time. Transfer to the airport for your onward journey.",
    "imageId": null,
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbq4hy000ytbzgehn7eyp5",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "dayNumber": 5,
    "title": "Departure",
    "subtitle": null,
    "description": "After breakfast, disembark and transfer to Cochin Airport for your onward journey.",
    "imageId": null,
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4hy000utbzgn1o8bis1",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "dayNumber": 1,
    "title": "Arrival in Kochi",
    "subtitle": null,
    "description": "Arrive in Kochi and explore Fort Kochi, Chinese Fishing Nets, St. Francis Church, and Jew Town. Overnight stay in Kochi.",
    "imageId": "cmrnbo524002gkjzgu9sdac6z",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4hy000vtbzgvab6q81q",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "dayNumber": 2,
    "title": "Munnar Hill Station",
    "subtitle": null,
    "description": "Drive to Munnar. En route, visit tea gardens and waterfalls. Explore Tea Museum and enjoy the cool climate. Overnight stay in Munnar.",
    "imageId": "cmrnbo51t002fkjzgljrxs29w",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4hy000wtbzgmpagcsrg",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "dayNumber": 3,
    "title": "Thekkady Wildlife",
    "subtitle": null,
    "description": "Drive to Thekkady. Visit Periyar Wildlife Sanctuary and enjoy a boat safari. Explore spice plantations. Overnight stay in Thekkady.",
    "imageId": "cmrnbo52e002hkjzg2xoy9hth",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4hy000xtbzg3si5c6yg",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "dayNumber": 4,
    "title": "Alleppey Houseboat",
    "subtitle": null,
    "description": "Drive to Alleppey and board your luxury houseboat. Cruise through the serene backwaters. Overnight stay onboard the houseboat.",
    "imageId": "cmrnbo51j002ekjzgml5n5jed",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbo5fk007pkjzgcoj6zub1",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "dayNumber": 1,
    "title": "Arrival in Chennai",
    "subtitle": "Capital Gateway",
    "description": "Arrive in Chennai and transfer to your hotel. Explore Marina Beach, Kapaleeshwarar Temple and local markets. Overnight stay in Chennai.",
    "imageId": "cmrnbo5e9006mkjzg7yjj4bot",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fk007qkjzg392v0oi6",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "dayNumber": 2,
    "title": "Chennai to Mahabalipuram to Pondicherry",
    "subtitle": "Coastal Heritage",
    "description": "Drive to Mahabalipuram, visit Shore Temple and Pancha Rathas. Continue to Pondicherry. Explore the French Quarter and Promenade Beach. Overnight stay in Pondicherry.",
    "imageId": "cmrnbo5eb006nkjzgd3vumd12",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fk007rkjzgw9j6wqx4",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "dayNumber": 3,
    "title": "Pondicherry to Thanjavur",
    "subtitle": "Chola Dynasty Heart",
    "description": "Drive to Thanjavur, visit Brihadeeswarar Temple (UNESCO World Heritage Site) and Thanjavur Palace. Explore local art & crafts. Overnight stay in Thanjavur.",
    "imageId": "cmrnbo5e7006lkjzg1r4z4hs3",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fk007skjzgkmhb65c0",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "dayNumber": 4,
    "title": "Thanjavur to Madurai",
    "subtitle": "Temple City Aarti",
    "description": "Drive to Madurai, visit Meenakshi Amman Temple and Thirumalai Nayakkar Palace. Experience the vibrant evening aarti. Overnight stay in Madurai.",
    "imageId": "cmrnbo5e5006kkjzg79j95q57",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fk007tkjzggmf44chi",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "dayNumber": 5,
    "title": "Madurai to Kodaikanal",
    "subtitle": "Serene Mist Hills",
    "description": "Drive to Kodaikanal, a serene hill station. Enjoy boating at Kodaikanal Lake and visit Coaker's Walk. Overnight stay in Kodaikanal.",
    "imageId": "cmrnbo5ey006ykjzgiib7judz",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fk007ukjzgbn6pf7g9",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "dayNumber": 6,
    "title": "Depart from Madurai",
    "subtitle": "Onward Journey",
    "description": "After breakfast, transfer to Madurai Airport/Railway Station for your onward journey with beautiful memories.",
    "imageId": null,
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 6,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5il00afkjzgiol89mz5",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "dayNumber": 1,
    "title": "Arrival & Wildlife Orientation",
    "subtitle": "Welcome to the Wild",
    "description": "Arrive at the airport and transfer to your resort near the wildlife sanctuary. Enjoy a nature walk and briefing with your naturalist.",
    "imageId": "cmrnbo5hk009gkjzgb5ppmxfd",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5il00agkjzg5d9xmvu1",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "dayNumber": 2,
    "title": "Safari Adventure",
    "subtitle": "Deep into the Jungle",
    "description": "Early morning jeep safari in the national park. Spot tigers, leopards, deer and a variety of birds. Evening at leisure.",
    "imageId": "cmrnbo5ho009ikjzgmc4n9wms",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5il00ahkjzgieylbirr",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "dayNumber": 3,
    "title": "Explore & Experience",
    "subtitle": "Boat Safari & Culture",
    "description": "Enjoy a boat safari or jungle safari. Visit to interpretation centre or local village. Learn about conservation efforts and local culture.",
    "imageId": "cmrnbo5hm009hkjzgqqevdcuj",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5il00aikjzgp98w0b39",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "dayNumber": 4,
    "title": "Another Safari",
    "subtitle": "Jungle Tracking",
    "description": "Enjoy a boat safari or jungle safari. Capture stunning wildlife moments and unwind in nature.",
    "imageId": "cmrnbo5ha009bkjzg57jyrzh6",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5il00ajkjzgw8ognksr",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "dayNumber": 5,
    "title": "Departure",
    "subtitle": "Farewell Wilds",
    "description": "After breakfast, transfer to the airport/station for your onward journey with unforgettable memories.",
    "imageId": null,
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ll00d4kjzgckk7n34l",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "dayNumber": 1,
    "title": "Arrival & Consultation",
    "subtitle": "Welcome to Wellness",
    "description": "Arrive and check in to your wellness resort. Undergo a consultation with an Ayurveda doctor and enjoy a relaxing therapy.",
    "imageId": "cmrnbo5kj00c5kjzg2j2326yc",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ll00d5kjzg9n6n16vy",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "dayNumber": 2,
    "title": "Detox & Rejuvenate",
    "subtitle": "Personalized Program",
    "description": "Begin your personalized wellness program with therapies, yoga and a balanced Ayurvedic diet.",
    "imageId": "cmrnbo5kn00c7kjzgtdpgaas4",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ll00d6kjzgqvtfa9da",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "dayNumber": 3,
    "title": "Mind & Body Balance",
    "subtitle": "Meditation & Health",
    "description": "Experience yoga, meditation and holistic treatments designed to balance your body and mind.",
    "imageId": "cmrnbo5kl00c6kjzgkv2uk3pb",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ll00d7kjzg810kr3j0",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "dayNumber": 4,
    "title": "Healing & Relaxation",
    "subtitle": "Serene Reconnection",
    "description": "Continue therapies and enjoy leisure time amidst nature. Optional spa or cultural experiences.",
    "imageId": "cmrnbo5ka00c0kjzgdcy9z75k",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ll00d8kjzg1yz60aca",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "dayNumber": 5,
    "title": "Departure",
    "subtitle": "Renewed Energy",
    "description": "After breakfast, check out and depart with renewed energy and inner peace.",
    "imageId": null,
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ml00eekjzg6l8pui4g",
    "packageId": "cmrnbo5mi00eakjzgkmzblx2j",
    "dayNumber": 1,
    "title": "Arrival in Sri Lanka",
    "subtitle": "Island Harmony",
    "description": "Arrive and transfer to a beachfront wellness pavilion.",
    "imageId": "cmrnbo5kf00c3kjzgw2y6q8vz",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.042Z"
  },
  {
    "id": "cmrnbo575004ekjzg930ph6sr",
    "packageId": "cmrnbo571004akjzg2kkpmrk3",
    "dayNumber": 1,
    "title": "Arrival in Colombo",
    "subtitle": "Capital Coast",
    "description": "Arrive at Colombo airport and transfer to hotel.",
    "imageId": "cmrnbo50r002bkjzgnuaimpgr",
    "country": null,
    "state": null,
    "city": null,
    "lat": null,
    "lng": null,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.485Z"
  }
];
const experiencesData: any[] = [
  {
    "id": "cmrnbo4zm0027kjzgc3b17ow5",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "title": "Sunset Cruise on Mandovi River",
    "description": "Enjoy a relaxing evening cruise with music and beautiful views of the sunset.",
    "imageOneId": "cmrnbo4ow0007kjzggbmfw1e1",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrngshte00072kf0mfz2ugeg",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Sunrise visit to the Taj Mahal",
    "description": "no",
    "imageOneId": "cmrnf75iv0042tbzg7z7g3tmr",
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshtf00082kf0fm2583xs",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Explore Old Delhi & Chandni Chowk",
    "description": "no",
    "imageOneId": "cmrnf7yfl0043tbzgesbtioa9",
    "sortOrder": 1,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshtf00092kf0azd7nm16",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Amber Fort & Eleph and Ride in Jaipur",
    "description": "no",
    "imageOneId": "cmrnf8d6z0044tbzgaxb8utji",
    "sortOrder": 2,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshtf000a2kf0wswgitkg",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "UNESCO World Heritage Sites",
    "description": "no",
    "imageOneId": "cmrnf8z170045tbzgd5ubsjhn",
    "sortOrder": 3,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshtf000b2kf0bgfz38nf",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Royal Palaces, Forts & Havelis",
    "description": "no",
    "imageOneId": "cmrnf95xw0046tbzgzkrq2cxc",
    "sortOrder": 4,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrnbo5d1005nkjzgi3m2pk1i",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Pristine Beaches",
    "description": "Sunbathe on gold sand, stroll along scenic palm-fringed coastlines, and witness beautiful sunsets over the Arabian Sea.",
    "imageOneId": "cmrnbo59b004lkjzg00xd8v0c",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d1005okjzgle5g26fc",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Water Sports & Adventure",
    "description": "Experience the rush of jet-skiing, parasailing, and banana boat rides on dynamic beaches.",
    "imageOneId": "cmrnbo59u004nkjzgo6oyiajn",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d1005pkjzghuowbkk5",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Nightlife & Beach Clubs",
    "description": "Party in style at Tito's Lane, Curlies, or premium open-air beach clubs across the coast.",
    "imageOneId": "cmrnbo4ow0007kjzggbmfw1e1",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d1005qkjzgx147bizg",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Portuguese Heritage & Culture",
    "description": "Step back in time walking through Fontainhas (Latin Quarter) and visiting historic churches of Old Goa.",
    "imageOneId": "cmrnbo5a4004okjzgpaxuoyq5",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d1005rkjzg9a59lszg",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Local Markets & Goan Cuisine",
    "description": "Shop for unique handicrafts at Anjuna flea market and savor local Goan seafood curries.",
    "imageOneId": "cmrnbo4pp000akjzgallpdirl",
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbq4i2000ztbzg8yztlub1",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Backwaters & Houseboat Stay",
    "description": "Glide along palm-fringed canals, lakes, and lagoons in a traditional Kettuvallam (houseboat). Enjoy freshly prepared local cuisine onboard.",
    "imageOneId": "cmrnbo51j002ekjzgml5n5jed",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4i20010tbzgoquls1ny",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Hill Stations & Tea Gardens",
    "description": "Stroll through Munnar's emerald tea plantations, learn about tea processing, and enjoy panoramic views from hill stations.",
    "imageOneId": "cmrnbo51t002fkjzgljrxs29w",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4i20011tbzg9sv3iu0y",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Ayurveda Wellness & Spa",
    "description": "Indulge in authentic rejuvenative Ayurvedic oil massages and traditional wellness sessions.",
    "imageOneId": "cmrnbo4ow0007kjzggbmfw1e1",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4i20012tbzgb991siu8",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Wildlife & Nature",
    "description": "Discover native elephants, tigers, and exotic birds on a scenic boat cruise in Periyar lake.",
    "imageOneId": "cmrnbo52e002hkjzg2xoy9hth",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4i20013tbzgx9jykux5",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Beaches & Coastal Beauty",
    "description": "Relax on the golden sands of Kovalam, walk along dramatic red cliffs, and witness sunset over the Arabian Sea.",
    "imageOneId": "cmrnbo4nu0003kjzgzzfpkfxz",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbo5fm007vkjzg9yle6seq",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Magnificent Temple Architecture",
    "description": "Marvel at towering Gopurams, intricate carvings, and thousand-pillar halls in historic temples.",
    "imageOneId": "cmrnbo5e5006kkjzg79j95q57",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fm007wkjzgpri1enm4",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "UNESCO World Heritage Sites",
    "description": "Explore Shore Temple of Mahabalipuram and the Great Living Chola Temples.",
    "imageOneId": "cmrnbo5e7006lkjzg1r4z4hs3",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fm007xkjzg3dwm65cu",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Classical Dance & Music",
    "description": "Immerse yourself in Bharatanatyam dance performances and Carnatic classical music recitals.",
    "imageOneId": "cmrnbo4ow0007kjzggbmfw1e1",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fm007ykjzg82xi1aja",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Scenic Hill Stations",
    "description": "Escape the heat in pristine mist-clad mountains and tea estates of Kodaikanal and Ooty.",
    "imageOneId": "cmrnbo5ey006ykjzgiib7judz",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fm007zkjzglp3ugxat",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Pristine Beaches & Backwaters",
    "description": "Stroll along French-style promenades and golden sand shores of Pondicherry and Chennai.",
    "imageOneId": "cmrnbo4p60008kjzglrsc28u7",
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fm0080kjzgz48uo9k4",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Authentic South Indian Cuisine",
    "description": "Savor traditional vegetarian meals served on banana leaves and spicy Chettinad dishes.",
    "imageOneId": "cmrnbo5ek006rkjzg8c58cz5e",
    "sortOrder": 6,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5in00akkjzgpxpcf4h5",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Thrilling Wildlife Safaris",
    "description": "Ride open-top 4x4 vehicles tracking apex predators with professional guides.",
    "imageOneId": "cmrnbo5ho009ikjzgmc4n9wms",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5in00alkjzg9282ji2o",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Tiger Spotting in Natural Habitat",
    "description": "Venture into prime tiger territories of Ranthambore and Bandhavgarh for sightings.",
    "imageOneId": "cmrnbo5hk009gkjzgb5ppmxfd",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5in00amkjzg2ck8npxb",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Bird Watching & Nature Walks",
    "description": "Walk through forest trails listing rare endemic bird species alongside naturalists.",
    "imageOneId": "cmrnbo4ow0007kjzggbmfw1e1",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5in00ankjzge0ztzfi3",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Expert Naturalist Guides",
    "description": "Learn about bird calls, pugmarks, and animal behavior from seasoned guides.",
    "imageOneId": "cmrnbo4p60008kjzglrsc28u7",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5in00aokjzgm4jv0q9c",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Photography Opportunities",
    "description": "Capture pristine frames of birds, animals, and forest canopies during golden hour.",
    "imageOneId": "cmrnbo5ha009bkjzg57jyrzh6",
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5in00apkjzgexdxgx25",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Conservation & Responsible Tourism",
    "description": "Support local forest reserves, buffer-zone villages, and eco-friendly practices.",
    "imageOneId": "cmrnbo5hm009hkjzgqqevdcuj",
    "sortOrder": 6,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5lm00d9kjzg3ixt2fmb",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Authentic Ayurveda Treatments",
    "description": "Undergo classical Abhyanga, Shirodhara, and custom herbal steam baths under expert guidance.",
    "imageOneId": "cmrnbo5kj00c5kjzg2j2326yc",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lm00dakjzgzofaruev",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Panchakarma Detox Programs",
    "description": "Purify body and mind with deep cleansing treatments tailored to your constitution.",
    "imageOneId": "cmrnbo5kn00c7kjzgtdpgaas4",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lm00dbkjzgdbxyb83s",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Yoga & Meditation Sessions",
    "description": "Practice traditional Hatha or Ashtanga yoga alongside guided meditation by the river or sea.",
    "imageOneId": "cmrnbo4ow0007kjzggbmfw1e1",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lm00dckjzg5oi7049q",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Herbal Therapies & Massage",
    "description": "Relieve stress with warm herbal poultice massage and essential oil applications.",
    "imageOneId": "cmrnbo4p60008kjzglrsc28u7",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lm00ddkjzg88afo2zi",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Wellness Cuisine & Lifestyle Guidance",
    "description": "Learn your Doshas constitution and how to adapt your nutrition for long-term health.",
    "imageOneId": "cmrnbo5kp00c8kjzgolgm2dv5",
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lm00dekjzg7hsibfi2",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Peaceful Natural Surroundings",
    "description": "Reconnect with yourself in tranquil coastal locations, mountain valleys, or forest sanctuaries.",
    "imageOneId": "cmrnbo5kl00c6kjzgkv2uk3pb",
    "sortOrder": 6,
    "createdAt": "2026-07-16T09:44:18.004Z"
  }
];
const hotelsData: any[] = [
  {
    "id": "cmrnbo4zn0028kjzgb85als7f",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "title": "Taj Exotica Resort & Spa",
    "description": "Mediterranean-inspired luxury resort situated on the southwest coast of Goa.",
    "rating": 5,
    "imageId": "cmrnbo4on0006kjzg93dj0fq2",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrngshtp000c2kf0f47jug1b",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "ITC Grand Bharat Hotel",
    "description": "Delhi",
    "rating": 5,
    "imageId": "cmrnfbbiz004utbzgo7eytr7c",
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshtp000d2kf0v9x9b5bw",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "The Leela Palace",
    "description": "Delhi",
    "rating": 5,
    "imageId": "cmrnfbelk004vtbzglg9jjt65",
    "sortOrder": 1,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshtq000e2kf0barp96jq",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Taj Hotel ",
    "description": "Delhi",
    "rating": 5,
    "imageId": "cmrnfblyo004wtbzgj6sn2w50",
    "sortOrder": 2,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshtq000f2kf0p5bcq0u2",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Rambagh Palace",
    "description": "Delhi",
    "rating": 5,
    "imageId": "cmrnfbp42004xtbzgs03fb0t3",
    "sortOrder": 3,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrnbo5d2005skjzg05i894d2",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "ITC Grand Goa",
    "description": "5-star premium luxury beach resort featuring Indo-Portuguese village style architecture and a multi-level pool.",
    "rating": 5,
    "imageId": "cmrnbo5b6004skjzge6txnzj3",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d2005tkjzgygrb64rt",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "The St. Regis Goa",
    "description": "5-star sanctuary nestled between the sea and Sal river with golf course, wellness spa, and pristine beach access.",
    "rating": 5,
    "imageId": "cmrnbo5bf004tkjzglttp2our",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d2005ukjzgpl9tdyfy",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "W Goa",
    "description": "5-star trendy coastal resort overlooking Vagator beach with iconic sunset views and modern design.",
    "rating": 5,
    "imageId": "cmrnbo5bn004ukjzgtco49z2a",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d2005vkjzgjtdpcmym",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Grand Hyatt Goa",
    "description": "5-star resort overlooking Bambolim bay offering luxury rooms, standard spa therapy, and indoor/outdoor pools.",
    "rating": 5,
    "imageId": "cmrnbo5ck004vkjzgdle8wl8l",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbq4i50014tbzg0qtpbmd1",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Taj Malabar Resort & Spa",
    "description": "5-star luxury heritage resort perched on Willingdon Island with spectacular views of Cochin harbor.",
    "rating": 5,
    "imageId": "cmrnbo53i002lkjzgqmydcc9p",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4i50015tbzgc9edm0oo",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "The Leela Kovalam",
    "description": "5-star cliff-top beach resort offering breathtaking views of the Arabian Sea and pristine private beaches.",
    "rating": 5,
    "imageId": "cmrnbo53s002mkjzgxkc1y119",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4i50016tbzgyyiilir3",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Brunton Boatyard",
    "description": "5-star heritage hotel in Fort Kochi capturing the colonial historical charm of Portuguese, Dutch, and British eras.",
    "rating": 5,
    "imageId": "cmrnbo542002nkjzgvuf7kabp",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4i50017tbzg5d47fhfc",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Spice Village Resort",
    "description": "5-star eco-friendly tribal village resort in Thekkady reflecting traditional local lifestyles.",
    "rating": 5,
    "imageId": "cmrnbo54c002okjzg7wrj5pfk",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbo5fn0081kjzg9y9epkwt",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Taj Coromandel, Chennai",
    "description": "5-star legendary luxury hotel offering classic elegance, prime location, and award-winning dining.",
    "rating": 5,
    "imageId": "cmrnbo5em006skjzg6c9di5do",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fn0082kjzgp4a7brb2",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "The Banyan Tree, Pondicherry",
    "description": "5-star boutique resort combining French colonial architecture with peaceful coastal gardens.",
    "rating": 5,
    "imageId": "cmrnbo5eo006tkjzgxuym61rl",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fn0083kjzgk8uryyga",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Svatma, Thanjavur",
    "description": "5-star heritage art hotel offering holistic wellness, traditional arts, and classical Tamil hospitality.",
    "rating": 5,
    "imageId": "cmrnbo5eq006ukjzgwtl0z3at",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fn0084kjzgvpy2arkb",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Heritage Madurai",
    "description": "5-star resort designed by Geoffrey Bawa featuring beautiful courtyards and Olympic-sized temple pool.",
    "rating": 5,
    "imageId": "cmrnbo5es006vkjzg372r19jq",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fn0085kjzgo72ab0kj",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "The Tamara Kodai",
    "description": "5-star luxury heritage resort set in a restored 1840s monastery amid mist-clad Kodai hills.",
    "rating": 5,
    "imageId": "cmrnbo5eu006wkjzgjffzsd5t",
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5io00aqkjzgmnvwyle3",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Jawai Leopard Camp",
    "description": "5-star ultra-luxury tented camp located among dramatic granite rock formations where leopards roam free.",
    "rating": 5,
    "imageId": "cmrnbo5hy009nkjzghum7vx1s",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5io00arkjzgkokjdarl",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "The Oberoi Vanyavilas",
    "description": "5-star jungle resort in Ranthambore featuring luxury tents, lovely pools, and beautiful orchard gardens.",
    "rating": 5,
    "imageId": "cmrnbo5i0009okjzgzzacegg3",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5io00askjzgzpvjrc5a",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Aahana - The Corbett Wilderness",
    "description": "5-star eco-luxury resort sharing a boundary with Jim Corbett Reserve, famous for organic farming and walks.",
    "rating": 5,
    "imageId": "cmrnbo5i2009pkjzge3wqmn17",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5io00atkjzgh7js4n9h",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Kanha Earth Lodge",
    "description": "5-star award-winning eco-lodge set in 16 acres of natural forest buffer zone near Kanha park.",
    "rating": 5,
    "imageId": "cmrnbo5i4009qkjzgxf2zncoa",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5io00aukjzg79t6rsvu",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "The Diphlu River Lodge",
    "description": "5-star luxury lodge in Kaziranga offering direct riverfront views and easy access to rhino safaris.",
    "rating": 5,
    "imageId": "cmrnbo5i6009rkjzg5wy60s0p",
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ln00dfkjzg89d6qhbk",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Somatheeram Ayurveda Resort",
    "description": "5-star legendary beach retreat in Kerala, widely regarded as the world's first Ayurveda resort.",
    "rating": 5,
    "imageId": "cmrnbo5kw00cckjzg7al1hygm",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ln00dgkjzgztza4m3g",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Carnoustie Ayurveda & Wellness Resort",
    "description": "5-star luxury eco-resort in Kerala backwaters offering world-class standard wellness programs.",
    "rating": 5,
    "imageId": "cmrnbo5l000cdkjzgjmat9qnu",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ln00dhkjzg6smrhqq8",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Ananda in the Himalayas",
    "description": "5-star luxury wellness sanctuary in Uttarakhand set in a maharaja's palace estate overlooking Ganges.",
    "rating": 5,
    "imageId": "cmrnbo5l200cekjzglnpf80br",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ln00dikjzg6wskyks6",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "The Dune Eco Village & Spa",
    "description": "5-star unique eco-friendly heritage village in Pondicherry (Tamil Nadu) with standard spa therapy.",
    "rating": 5,
    "imageId": "cmrnbo5l500cfkjzgk970a382",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5ln00djkjzg2rwoeyoh",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Jetwing Ayurveda Pavilions",
    "description": "5-star tranquil sanctuary in Sri Lanka designed specifically for guests seeking deep holistic healing.",
    "rating": 5,
    "imageId": "cmrnbo5l700cgkjzg4mp0ex54",
    "sortOrder": 5,
    "createdAt": "2026-07-16T09:44:18.004Z"
  }
];
const goodToKnowsData: any[] = [
  {
    "id": "cmrnbo4zj0022kjzgy1jiyqxp",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "title": "Beach Attire",
    "description": "Beachwear is accepted on the beaches, but conservative clothing is recommended for towns.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrngshu2000g2kf0rhwi7wws",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Visa:",
    "description": "e-Tourist Visa available",
    "iconId": "cmrnbo4r1000fkjzguke89epp",
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshu2000h2kf0gil1yqol",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Flight Time from London:",
    "description": "~9 hrs",
    "iconId": "cmrnbo4uy000tkjzgpbh03ot1",
    "sortOrder": 1,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshu2000i2kf029yotv7h",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Currency:",
    "description": "Indian Rupee (INR)",
    "iconId": "cmrnbo4uo000skjzg4h1d03ro",
    "sortOrder": 2,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshu2000j2kf00w1npy6d",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Best Season:",
    "description": "Oct to Mar",
    "iconId": "cmrnbo4uo000skjzg4h1d03ro",
    "sortOrder": 3,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshu2000k2kf0dbhynrgv",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Language:",
    "description": "English widely spoken",
    "iconId": "cmrnbo4ue000rkjzgwgc5c53q",
    "sortOrder": 4,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshu2000l2kf02swbp870",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Private Airport Transfers",
    "description": " ",
    "iconId": "cmrnbo4ue000rkjzgwgc5c53q",
    "sortOrder": 5,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshu2000m2kf0vrs71eyz",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Time Difference:",
    "description": "GMT +5:30",
    "iconId": "cmrnbo4tl000okjzgfn46hsci",
    "sortOrder": 6,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshu2000n2kf0aojs855k",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Daily Breakfast Included",
    "description": " ",
    "iconId": "cmrnbo4tv000pkjzg6s2yykls",
    "sortOrder": 7,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrnbo5d3005wkjzg5uezpntz",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Best Time to Travel",
    "description": "November to February is ideal for beach activities, cool weather, and vibrant nightlife.",
    "iconId": "cmrnbo4r1000fkjzguke89epp",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d3005xkjzgt7zccgmw",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Weather Range",
    "description": "Tropical climate with pleasant temperatures ranging between 18°C and 32°C.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d3005ykjzgq9j1o5ia",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Internal Travel Duration",
    "description": "Pan Goa local travel ranges from 30 minutes to 1.5 hours between North and South.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbq4ia0018tbzgj64l7f7c",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Best Time to Travel",
    "description": "September to March is ideal for comfortable weather and clear backwaters.",
    "iconId": "cmrnbo4r1000fkjzguke89epp",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4ia0019tbzgvuq90k56",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Weather Range",
    "description": "Expect comfortable tropical temperatures between 20°C and 30°C.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4ia001atbzgymyuw5uq",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Internal Travel Duration",
    "description": "Travel times vary by destination: scenic winding roads through hills can take longer.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbo5fo0086kjzgeeb2vqde",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Best Time to Travel",
    "description": "October to March offers cool and pleasant weather, perfect for temple sightseeing.",
    "iconId": "cmrnbo4r1000fkjzguke89epp",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fo0087kjzgn9l9fb2y",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Weather Range",
    "description": "Tropical climate with temperatures ranging comfortably between 20°C and 32°C.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fo0088kjzgxgg2hzg6",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Internal Travel Duration",
    "description": "Travel times vary by destination, with hilly roads to Kodaikanal taking longer.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5ip00avkjzgjo9wwqdo",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Best Time to Travel",
    "description": "October to June is ideal; most tiger parks remain closed during monsoon months (July-September).",
    "iconId": "cmrnbo4r1000fkjzguke89epp",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ip00awkjzg6oxptzvv",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Weather Range",
    "description": "Expect varying temperatures between 15°C and 35°C depending on the forest zone.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ip00axkjzg9nu7f2p6",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Internal Travel Duration",
    "description": "Local travel times vary by forest zones, with drives between sanctuaries taking several hours.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5lo00dkkjzgv6rwfz01",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Best Time to Travel",
    "description": "October to April offers dry and pleasant weather, though monsoons (June-September) are historically favored for deep detox therapies.",
    "iconId": "cmrnbo4r1000fkjzguke89epp",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lo00dlkjzgup4ivqs8",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Weather Range",
    "description": "Enjoy mild and warm conditions ranging comfortably between 18°C and 32°C.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lo00dmkjzgli7nplfb",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Wellness Focus",
    "description": "Our custom packages are structured around aligning Mind, Body, and Soul via personalized routines.",
    "iconId": "cmrnbo4rf000gkjzgahyshr72",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:18.004Z"
  }
];
const localCuisinesData: any[] = [
  {
    "id": "cmrnbo4zo0029kjzggblxeado",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "title": "Goan Fish Curry",
    "imageId": "cmrnbo4pp000akjzgallpdirl",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrngshun000s2kf0ztlg2hhm",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Butter Chicken, Chole Bhature, Paratha",
    "imageId": "cmrnfn9ay006ctbzgio4drble",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshun000t2kf0ug46j0ss",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Agra Petha, Bedai, Mughlai Kebabs",
    "imageId": "cmrnfngqo006dtbzgwrb1ubnx",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 1,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshuo000u2kf0vl45uhhk",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Dal Baati Churma, Pyaaz Kachori, Ghewar",
    "imageId": "cmrnfnlez006etbzg445hn25m",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 2,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrnbo5d4005zkjzgcctwzj0q",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Goan Fish Curry, Prawn Balchão, Bebinca, Sorpotel",
    "imageId": "cmrnbo5ad004pkjzgtiof4p4c",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d40060kjzgybqm3uf9",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Xacuti, Vindaloo, Cafreal, Feni (Local Drink)",
    "imageId": "cmrnbo5an004qkjzg4uy1zlyr",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d40061kjzglp0hh5r1",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Goan Sausages, Poi Bread, Tender Coconut, Tandoori Pomfret",
    "imageId": "cmrnbo5aw004rkjzgvhtk5pbo",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbq4ig001ftbzggjtpgkao",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Appam with Stew, Puttu with Kadala Curry",
    "imageId": "cmrnbo52o002ikjzgfz2yrh7f",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4ig001gtbzg9j2gxrb0",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Kerala Sadya, Fish Moilee, Karimeen Pollichathu",
    "imageId": "cmrnbo52x002jkjzgsl5uc1ti",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4ig001htbzgrywo71qj",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Malabar Parotta, Beef Fry, Payasam",
    "imageId": "cmrnbo537002kkjzg7brd5l89",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbo5fp0089kjzg17o6rj39",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Chennai: Filter Coffee, Dosa, Idli, Chettinad Cuisine",
    "imageId": "cmrnbo5ee006okjzgm1ev8mob",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fp008akjzgm8nleeqb",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Madurai: Jigarthanda, Kari Dosa, Mutton Chukka",
    "imageId": "cmrnbo5eg006pkjzgcd1gd7kp",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fp008bkjzgiz7v4wlw",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Coimbatore: Kongu Nadu Cuisine, Idli, Vada, Puttu",
    "imageId": "cmrnbo5ei006qkjzg14h7ofmn",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fp008ckjzgq4hgeh58",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Tanjore: Thali, Kumbakonam Degree Coffee, Adhirasam",
    "imageId": "cmrnbo5ek006rkjzg8c58cz5e",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5iq00aykjzg4lly8tc9",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Puran Poli, Poha-Jalebi, Kachori (Ranthambore)",
    "imageId": "cmrnbo5hq009jkjzgp7pwz4na",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5iq00azkjzgivowd38v",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Daal Baati Churma, Mirchi Vada, Ker Sangri (Rajasthan)",
    "imageId": "cmrnbo5hs009kkjzgapwxqn4z",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5iq00b0kjzg7hiimm4e",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Fish Curry, Appam Stew, Malabar Parotta (Kerala)",
    "imageId": "cmrnbo5hu009lkjzg5i6gmuh5",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5iq00b1kjzgf0ibl54q",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Masala Chai, Pakoras, Jungle Picnic Meals",
    "imageId": "cmrnbo5hw009mkjzgpfexnk1p",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5lo00dnkjzgegei39a8",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Doshas Balancing Meals (Sattvic & nourishing food)",
    "imageId": "cmrnbo5kp00c8kjzgolgm2dv5",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lo00dokjzggu3triav",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Herbal Detox Drinks (Natural & refreshing)",
    "imageId": "cmrnbo5kr00c9kjzghtagp8yw",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lo00dpkjzgasvny1a3",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Kashayam & Herbal Teas (Traditional healing beverages)",
    "imageId": "cmrnbo5ks00cakjzgmmdiwhpw",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lo00dqkjzg9p4y58ir",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Organic & Local Ingredients (Fresh from nature)",
    "imageId": "cmrnbo5ku00cbkjzg4lvvsf0w",
    "iconId": "cmrnbo4ro000hkjzg3phd6h3y",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:18.004Z"
  }
];
const perfectForsData: any[] = [
  {
    "id": "cmrngshue000o2kf0llnwsklh",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "First-time Visitors",
    "iconId": "cmrnbo4ue000rkjzgwgc5c53q",
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshue000p2kf0ry9wb5gm",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Culture Lovers",
    "iconId": "cmrnbo4tv000pkjzg6s2yykls",
    "sortOrder": 1,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshue000q2kf0vudg3elb",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Photography Enthusiasts",
    "iconId": "cmrnbo4uy000tkjzgpbh03ot1",
    "sortOrder": 2,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshue000r2kf0f2ei6m8t",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Families",
    "iconId": "cmrnbo4u4000qkjzgp75zen7d",
    "sortOrder": 3,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrnbo5d50062kjzgzexfxxb8",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Couples",
    "iconId": "cmrnbo4tl000okjzgfn46hsci",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d50063kjzgh3k2fp2t",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Families",
    "iconId": "cmrnbo4u4000qkjzgp75zen7d",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d50064kjzgpz46mze0",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Luxury Travellers",
    "iconId": "cmrnbo4uo000skjzg4h1d03ro",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5d50065kjzg59c0jpds",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "First-time Visitors",
    "iconId": "cmrnbo4ue000rkjzgwgc5c53q",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbq4id001btbzgpd4mgwut",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Couples",
    "iconId": "cmrnbo4tl000okjzgfn46hsci",
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4id001ctbzg8vp51l4x",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Families",
    "iconId": "cmrnbo4u4000qkjzgp75zen7d",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4id001dtbzgaaktxq9a",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Luxury Travellers",
    "iconId": "cmrnbo4uo000skjzg4h1d03ro",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4id001etbzg0cnzxroy",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Photography Enthusiasts",
    "iconId": "cmrnbo4uy000tkjzgpbh03ot1",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbo5fq008dkjzghbqy2jn0",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Culture Lovers",
    "iconId": "cmrnbo4tv000pkjzg6s2yykls",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fq008ekjzguma5y6re",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Photography Enthusiasts",
    "iconId": "cmrnbo4uy000tkjzgpbh03ot1",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fq008fkjzgyp2axvld",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Families",
    "iconId": "cmrnbo4u4000qkjzgp75zen7d",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fq008gkjzgrnm4jidi",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "First-time Visitors",
    "iconId": "cmrnbo4ue000rkjzgwgc5c53q",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5ir00b2kjzgp9r5wh55",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Photography Enthusiasts",
    "iconId": "cmrnbo4uy000tkjzgpbh03ot1",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ir00b3kjzga37qmd3w",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Couples",
    "iconId": "cmrnbo4tl000okjzgfn46hsci",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ir00b4kjzgsxd4cerg",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Families",
    "iconId": "cmrnbo4u4000qkjzgp75zen7d",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ir00b5kjzg25sfz4ix",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Luxury Travellers",
    "iconId": "cmrnbo4uo000skjzg4h1d03ro",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5lp00drkjzg1h0sayjq",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Couples",
    "iconId": "cmrnbo4tl000okjzgfn46hsci",
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lp00dskjzgkf9u4bg7",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Luxury Travellers",
    "iconId": "cmrnbo4uo000skjzg4h1d03ro",
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lp00dtkjzg1l67msca",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Culture Lovers",
    "iconId": "cmrnbo4tv000pkjzg6s2yykls",
    "sortOrder": 3,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lp00dukjzgreeqioht",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "First-time Visitors",
    "iconId": "cmrnbo4ue000rkjzgwgc5c53q",
    "sortOrder": 4,
    "createdAt": "2026-07-16T09:44:18.004Z"
  }
];
const pricePackagesData: any[] = [
  {
    "id": "cmrnbo5mr00ehkjzg13hrb98f",
    "packageId": "cmrnbo5mp00efkjzgmte9bv8u",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night beachfront spa.",
    "price": "14000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.049Z"
  },
  {
    "id": "cmrnbo5jl00bnkjzg7ki5uqjp",
    "packageId": "cmrnbo5jk00blkjzgnqpsmek9",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night forest safari.",
    "price": "18000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.936Z"
  },
  {
    "id": "cmrnbo5jt00bskjzg10yy2pfx",
    "packageId": "cmrnbo5js00bqkjzg38zdztrf",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night riverfront safari.",
    "price": "20000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.944Z"
  },
  {
    "id": "cmrnbo5lx00dxkjzg3x75ccy9",
    "packageId": "cmrnbo5lv00dvkjzg1u1iee6n",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 3-night wellness stay.",
    "price": "18000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.019Z"
  },
  {
    "id": "cmrnbo5m400e2kjzgpu70q4xe",
    "packageId": "cmrnbo5m300e0kjzg1qfenj22",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 3-night yoga retreat.",
    "price": "20000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.027Z"
  },
  {
    "id": "cmrnbo5mb00e7kjzgvgp5fe7c",
    "packageId": "cmrnbo5ma00e5kjzg99cf7ygg",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night naturopathy program.",
    "price": "12000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.034Z"
  },
  {
    "id": "cmrnbo5gn008ykjzgjhus7kys",
    "packageId": "cmrnbo5gm008wkjzg2pfdf59b",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night coastal stay.",
    "price": "10000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.830Z"
  },
  {
    "id": "cmrnbo5gv0093kjzgqkuldluf",
    "packageId": "cmrnbo5gt0091kjzgzhvaoaog",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night quiet hill stay.",
    "price": "8000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.837Z"
  },
  {
    "id": "cmrnbo4zh001xkjzg0xuvs594",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for the 3-night beach extension.",
    "price": "15000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.211Z"
  },
  {
    "id": "cmrnbo55x0042kjzgjnnykj23",
    "packageId": "cmrnbo55v0040kjzg6g258t6l",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 3-night heritage tour.",
    "price": "18000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.443Z"
  },
  {
    "id": "cmrnbo56k0047kjzgaql94bfe",
    "packageId": "cmrnbo56j0045kjzg9rrmtqdk",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 3-night beach getaway.",
    "price": "25000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.467Z"
  },
  {
    "id": "cmrnbo5dh0068kjzgclotqqyv",
    "packageId": "cmrnbo5df0066kjzg8r2yepbs",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night city tour.",
    "price": "12000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.715Z"
  },
  {
    "id": "cmrnbo5dq006dkjzg3ayb9x8w",
    "packageId": "cmrnbo5dp006bkjzgg6rt31tm",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 4-night heritage experience.",
    "price": "29000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.725Z"
  },
  {
    "id": "cmrnbo5fy008jkjzgd02zc28u",
    "packageId": "cmrnbo5fx008hkjzglc5ug5o3",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night temple tour.",
    "price": "9000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.805Z"
  },
  {
    "id": "cmrnbo5g6008okjzg3d2yix73",
    "packageId": "cmrnbo5g4008mkjzgp8ybcsae",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 3-night hill station tour.",
    "price": "15000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.812Z"
  },
  {
    "id": "cmrnbo5gd008tkjzgv2usjo1y",
    "packageId": "cmrnbo5gc008rkjzgcngsit6s",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night heritage stay.",
    "price": "13000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.820Z"
  },
  {
    "id": "cmrnbo5iz00b8kjzgjyu340sn",
    "packageId": "cmrnbo5iy00b6kjzgf7fn8eos",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night forest stay.",
    "price": "16000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.914Z"
  },
  {
    "id": "cmrnbo5j700bdkjzgpfc2kxpo",
    "packageId": "cmrnbo5j600bbkjzguj8enrzi",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night forest retreat.",
    "price": "14000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.922Z"
  },
  {
    "id": "cmrnbo5je00bikjzglmlq35en",
    "packageId": "cmrnbo5jc00bgkjzgndwnbilj",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 2-night jungle stay.",
    "price": "15000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.928Z"
  },
  {
    "id": "cmrngshuw000v2kf0yionkshg",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Standard",
    "subtitle": "4-Star Accommodation",
    "description": "Comfortable stays and guided tours.",
    "price": "49999",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrngshuw000w2kf0rcypshqr",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "title": "Luxury",
    "subtitle": "5-Star Accommodation",
    "description": "Premium stays, private transfers, and exclusive experiences.",
    "price": "89999",
    "isDefault": false,
    "sortOrder": 1,
    "createdAt": "2026-07-16T12:07:38.500Z"
  },
  {
    "id": "cmrnbo5cw0052kjzglf3qrmjs",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Standard",
    "subtitle": "4-Star Beach Resorts",
    "description": "Lovely stays near the coast with breakfast and sightseeing.",
    "price": "24999",
    "isDefault": true,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5cw0053kjzglk8s4qmm",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "title": "Luxury",
    "subtitle": "5-Star Beach Resorts",
    "description": "Overnight luxury boutique stays (W Goa / St. Regis) with private transfers.",
    "price": "54999",
    "isDefault": false,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbq4ij001itbzgaadgx9gw",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Standard",
    "subtitle": "4-Star Resorts",
    "description": "Charming premium stays and houseboats.",
    "price": "39999",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbq4ik001jtbzg0ltec29t",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "title": "Luxury",
    "subtitle": "5-Star Resorts",
    "description": "Overnight luxury houseboat cruise and Taj/Leela wellness stays.",
    "price": "79999",
    "isDefault": false,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:45:49.888Z"
  },
  {
    "id": "cmrnbo5fh0078kjzgjrxslu2b",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Standard",
    "subtitle": "4-Star Hotels & Stays",
    "description": "Comfortable premium stays and guided heritage sightseeing.",
    "price": "34999",
    "isDefault": true,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fh0079kjzgjwihrm8k",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "title": "Luxury",
    "subtitle": "5-Star Luxury Stays",
    "description": "Stay at legendary heritage luxury properties (Taj Coromandel / Svatma) with private transfers.",
    "price": "74999",
    "isDefault": false,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5ij009ykjzg8klo0mk5",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Standard",
    "subtitle": "Premium Forest Lodges",
    "description": "Cozy jungle stays, shared safaris, and experienced naturalists.",
    "price": "29999",
    "isDefault": true,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ij009zkjzg7j9898k6",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "title": "Luxury",
    "subtitle": "Ultra-Luxury Lodges",
    "description": "Stays at Oberoi Vanyavilas or Jawai Camp with private open-jeep safaris.",
    "price": "69999",
    "isDefault": false,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5li00cnkjzgpjcx5oat",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Standard",
    "subtitle": "Authentic Wellness Retreats",
    "description": "Personalized herbal treatments, daily yoga sessions, and sattvic diet.",
    "price": "39999",
    "isDefault": true,
    "sortOrder": 1,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5li00cokjzgrr1iy9qs",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "title": "Luxury",
    "subtitle": "Ultra-Luxury Spas & Resorts",
    "description": "Stay at world-class luxury properties (Ananda / Carnoustie) with premium therapies.",
    "price": "89999",
    "isDefault": false,
    "sortOrder": 2,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5mj00eckjzgzyvwghza",
    "packageId": "cmrnbo5mi00eakjzgkmzblx2j",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 3-night island wellness program.",
    "price": "75000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:18.042Z"
  },
  {
    "id": "cmrnbo573004ckjzger7qw59r",
    "packageId": "cmrnbo571004akjzg2kkpmrk3",
    "title": "Add-on Price",
    "subtitle": null,
    "description": "Base price for 4-night island experience.",
    "price": "35000",
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-07-16T09:44:17.485Z"
  }
];
const bestSeasonsData: any[] = [];
const departureDatesData: any[] = [
  {
    "id": "cmrnbo4yg0016kjzg581jd53n",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "departureDate": "2026-08-15T00:00:00.000Z",
    "availableSeats": 12,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.171Z"
  },
  {
    "id": "cmrnbo4yg0017kjzgu0z96kwm",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "departureDate": "2026-09-10T00:00:00.000Z",
    "availableSeats": 8,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.171Z"
  },
  {
    "id": "cmrnbo4yg0018kjzgpny5i2r1",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "departureDate": "2026-10-05T00:00:00.000Z",
    "availableSeats": 20,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.171Z"
  },
  {
    "id": "cmrnbo5cx0054kjzguzb8m0r2",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "departureDate": "2026-11-01T00:00:00.000Z",
    "availableSeats": 20,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5cx0055kjzgalzyiu54",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "departureDate": "2026-12-15T00:00:00.000Z",
    "availableSeats": 15,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo5cx0056kjzg9smn4iez",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "departureDate": "2027-01-10T00:00:00.000Z",
    "availableSeats": 25,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.694Z"
  },
  {
    "id": "cmrnbo553002xkjzgt8mqc7yr",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "departureDate": "2026-09-01T00:00:00.000Z",
    "availableSeats": 15,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.411Z"
  },
  {
    "id": "cmrnbo553002ykjzgyu7sraoj",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "departureDate": "2026-10-10T00:00:00.000Z",
    "availableSeats": 10,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.411Z"
  },
  {
    "id": "cmrnbo553002zkjzgz4ucl0eo",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "departureDate": "2026-11-15T00:00:00.000Z",
    "availableSeats": 12,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.411Z"
  },
  {
    "id": "cmrnbo5fi007akjzg3914k23k",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "departureDate": "2026-10-15T00:00:00.000Z",
    "availableSeats": 15,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fi007bkjzg8j29tzx2",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "departureDate": "2026-11-20T00:00:00.000Z",
    "availableSeats": 12,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5fi007ckjzgbtulesjj",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "departureDate": "2026-12-10T00:00:00.000Z",
    "availableSeats": 18,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.787Z"
  },
  {
    "id": "cmrnbo5ij00a0kjzgv1zsgp1a",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "departureDate": "2026-10-10T00:00:00.000Z",
    "availableSeats": 12,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ij00a1kjzge6c2kvmj",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "departureDate": "2026-11-15T00:00:00.000Z",
    "availableSeats": 10,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5ij00a2kjzg83i7rx3a",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "departureDate": "2026-12-20T00:00:00.000Z",
    "availableSeats": 8,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:17.896Z"
  },
  {
    "id": "cmrnbo5lj00cpkjzgeuljhz30",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "departureDate": "2026-10-05T00:00:00.000Z",
    "availableSeats": 10,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lj00cqkjzg1vvahcgk",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "departureDate": "2026-11-12T00:00:00.000Z",
    "availableSeats": 8,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:18.004Z"
  },
  {
    "id": "cmrnbo5lj00crkjzgbhsyrfto",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "departureDate": "2026-12-18T00:00:00.000Z",
    "availableSeats": 12,
    "isActive": true,
    "createdAt": "2026-07-16T09:44:18.004Z"
  }
];
const packageGalleriesData: any[] = [
  {
    "id": "cmrnbo5mq00egkjzgj0cv2t6d",
    "packageId": "cmrnbo5mp00efkjzgmte9bv8u",
    "imageId": "cmrnbo5kh00c4kjzgpy4ccwhu",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5jl00bmkjzgz51xlzlb",
    "packageId": "cmrnbo5jk00blkjzgnqpsmek9",
    "imageId": "cmrnbo5hg009ekjzg0l4tiyu9",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5jt00brkjzg6uvdq9r3",
    "packageId": "cmrnbo5js00bqkjzg38zdztrf",
    "imageId": "cmrnbo5hi009fkjzgj6enzw9u",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5lw00dwkjzg3ehuahle",
    "packageId": "cmrnbo5lv00dvkjzg1u1iee6n",
    "imageId": "cmrnbo5ka00c0kjzgdcy9z75k",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5m400e1kjzg4uv2o27n",
    "packageId": "cmrnbo5m300e0kjzg1qfenj22",
    "imageId": "cmrnbo5kb00c1kjzgn1pamdkt",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5ma00e6kjzgzdy8dudq",
    "packageId": "cmrnbo5ma00e5kjzg99cf7ygg",
    "imageId": "cmrnbo5kd00c2kjzge6621qv7",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5gm008xkjzgkpeejzzp",
    "packageId": "cmrnbo5gm008wkjzg2pfdf59b",
    "imageId": "cmrnbo5f30070kjzgr9r5vv4d",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5gu0092kjzg3aj71yus",
    "packageId": "cmrnbo5gt0091kjzgzhvaoaog",
    "imageId": "cmrnbo5f50071kjzg2uha31vr",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo4zg001wkjzggpqmqw63",
    "packageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "imageId": "cmrnbo4o30004kjzg869j8am6",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo55w0041kjzg8wets0da",
    "packageId": "cmrnbo55v0040kjzg6g258t6l",
    "imageId": "cmrnbo519002dkjzgnbmw6lso",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo56k0046kjzgzctlbgar",
    "packageId": "cmrnbo56j0045kjzg9rrmtqdk",
    "imageId": "cmrnbo510002ckjzglbuptg7e",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5dg0067kjzgwe44pygi",
    "packageId": "cmrnbo5df0066kjzg8r2yepbs",
    "imageId": "cmrnbo58r004jkjzgabe5srbs",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5dq006ckjzgl0d3rvcy",
    "packageId": "cmrnbo5dp006bkjzgg6rt31tm",
    "imageId": "cmrnbo590004kkjzgd45621or",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5fx008ikjzge9pvo50t",
    "packageId": "cmrnbo5fx008hkjzglc5ug5o3",
    "imageId": "cmrnbo5ew006xkjzga7j7zb7g",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5g5008nkjzgkun51rrn",
    "packageId": "cmrnbo5g4008mkjzgp8ybcsae",
    "imageId": "cmrnbo5ey006ykjzgiib7judz",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5gd008skjzgkmmvi7wm",
    "packageId": "cmrnbo5gc008rkjzgcngsit6s",
    "imageId": "cmrnbo5f0006zkjzgbcrcvnod",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5iz00b7kjzgj0dekev9",
    "packageId": "cmrnbo5iy00b6kjzgf7fn8eos",
    "imageId": "cmrnbo5ha009bkjzg57jyrzh6",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5j700bckjzgasvxs2lf",
    "packageId": "cmrnbo5j600bbkjzguj8enrzi",
    "imageId": "cmrnbo5hc009ckjzg2g494nmu",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5jd00bhkjzg3v3y7216",
    "packageId": "cmrnbo5jc00bgkjzgndwnbilj",
    "imageId": "cmrnbo5he009dkjzgsm053wzg",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrngshv5000x2kf03545gm3r",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "imageId": "cmrnf0zac002xtbzgy97t56ed",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 0
  },
  {
    "id": "cmrnbo4yd0011kjzgul0nxaul",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "imageId": "cmrnbo4nl0002kjzgtl1g8icj",
    "isCover": false,
    "isBanner": true,
    "sortOrder": 2
  },
  {
    "id": "cmrnbo4yd0012kjzgrqjqf6mc",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "imageId": "cmrnbo4o30004kjzg869j8am6",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 3
  },
  {
    "id": "cmrnbo4yd0013kjzgmxzuk7a6",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "imageId": "cmrnbo4od0005kjzg6x9t2yas",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5cv004ykjzg4dhzx07r",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "imageId": "cmrnbo59b004lkjzg00xd8v0c",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5cv004zkjzgfemyvw26",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "imageId": "cmrnbo59k004mkjzgumwycl4a",
    "isCover": false,
    "isBanner": true,
    "sortOrder": 2
  },
  {
    "id": "cmrnbo5cv0050kjzgkj3u1eg6",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "imageId": "cmrnbo59u004nkjzgo6oyiajn",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 3
  },
  {
    "id": "cmrnbo5cv0051kjzgghjs2eh2",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "imageId": "cmrnbo5a4004okjzgpaxuoyq5",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 4
  },
  {
    "id": "cmrnbq4im001ktbzgu57kl9wv",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "imageId": "cmrnbo51j002ekjzgml5n5jed",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 0
  },
  {
    "id": "cmrnbo551002skjzgpw1ea2lk",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "imageId": "cmrnbo51t002fkjzgljrxs29w",
    "isCover": false,
    "isBanner": true,
    "sortOrder": 2
  },
  {
    "id": "cmrnbo551002tkjzg4eh5zlgg",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "imageId": "cmrnbo524002gkjzgu9sdac6z",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 3
  },
  {
    "id": "cmrnbo551002ukjzgjocok4wr",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "imageId": "cmrnbo52e002hkjzg2xoy9hth",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5fg0074kjzgpj7hurmy",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "imageId": "cmrnbo5e5006kkjzg79j95q57",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5fg0075kjzg0v7848nm",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "imageId": "cmrnbo5e7006lkjzg1r4z4hs3",
    "isCover": false,
    "isBanner": true,
    "sortOrder": 2
  },
  {
    "id": "cmrnbo5fg0076kjzgcaknm1sr",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "imageId": "cmrnbo5e9006mkjzg7yjj4bot",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 3
  },
  {
    "id": "cmrnbo5fg0077kjzgrug31za6",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "imageId": "cmrnbo5eb006nkjzgd3vumd12",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5ii009ukjzgifjraiti",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "imageId": "cmrnbo5hk009gkjzgb5ppmxfd",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5ii009vkjzgbypenfyl",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "imageId": "cmrnbo5hm009hkjzgqqevdcuj",
    "isCover": false,
    "isBanner": true,
    "sortOrder": 2
  },
  {
    "id": "cmrnbo5ii009wkjzgh938c678",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "imageId": "cmrnbo5ho009ikjzgmc4n9wms",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 3
  },
  {
    "id": "cmrnbo5ii009xkjzgy05trr3g",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "imageId": "cmrnbo5ha009bkjzg57jyrzh6",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5lh00cjkjzgc17lqpm5",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "imageId": "cmrnbo5kj00c5kjzg2j2326yc",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5lh00ckkjzgu022i2tc",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "imageId": "cmrnbo5kl00c6kjzgkv2uk3pb",
    "isCover": false,
    "isBanner": true,
    "sortOrder": 2
  },
  {
    "id": "cmrnbo5lh00clkjzgu9wwiuyk",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "imageId": "cmrnbo5kn00c7kjzgtdpgaas4",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 3
  },
  {
    "id": "cmrnbo5lh00cmkjzgt6az1mwo",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "imageId": "cmrnbo5ka00c0kjzgdcy9z75k",
    "isCover": false,
    "isBanner": false,
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5mj00ebkjzgjc7jaax2",
    "packageId": "cmrnbo5mi00eakjzgkmzblx2j",
    "imageId": "cmrnbo5kf00c3kjzgw2y6q8vz",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  },
  {
    "id": "cmrnbo572004bkjzgo9fu32ab",
    "packageId": "cmrnbo571004akjzg2kkpmrk3",
    "imageId": "cmrnbo50r002bkjzgnuaimpgr",
    "isCover": true,
    "isBanner": false,
    "sortOrder": 1
  }
];
const packageAddonsData: any[] = [
  {
    "id": "cmrnbo50c002akjzgrq2dktqq",
    "packageId": "cmrnbo4yb000ykjzg958bhshg",
    "addonPackageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5dw006gkjzgl3s8ex6n",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "addonPackageId": "cmrnbo5df0066kjzg8r2yepbs",
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5dz006hkjzgq5uxf4x8",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "addonPackageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "sortOrder": 2
  },
  {
    "id": "cmrnbo5e1006ikjzgabat30kw",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "addonPackageId": "cmrnbo5dp006bkjzgg6rt31tm",
    "sortOrder": 3
  },
  {
    "id": "cmrnbo5e3006jkjzg4c1z1qjq",
    "packageId": "cmrnbo5cu004wkjzgfznnm4zi",
    "addonPackageId": "cmrnbo571004akjzg2kkpmrk3",
    "sortOrder": 4
  },
  {
    "id": "cmrnbo57j004fkjzgyr1lz583",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "addonPackageId": "cmrnbo4zf001vkjzgbws5ei1k",
    "sortOrder": 1
  },
  {
    "id": "cmrnbo57s004gkjzgzhz7ki9v",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "addonPackageId": "cmrnbo55v0040kjzg6g258t6l",
    "sortOrder": 2
  },
  {
    "id": "cmrnbo582004hkjzgh6od9a0i",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "addonPackageId": "cmrnbo56j0045kjzg9rrmtqdk",
    "sortOrder": 3
  },
  {
    "id": "cmrnbo58d004ikjzgitvs141f",
    "packageId": "cmrnbo54z002pkjzgpw3dp8dt",
    "addonPackageId": "cmrnbo571004akjzg2kkpmrk3",
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5gz0096kjzgwo8syn0h",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "addonPackageId": "cmrnbo5fx008hkjzglc5ug5o3",
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5h10097kjzgsvrgbg7q",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "addonPackageId": "cmrnbo5g4008mkjzgp8ybcsae",
    "sortOrder": 2
  },
  {
    "id": "cmrnbo5h40098kjzggg5pq1ae",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "addonPackageId": "cmrnbo5gc008rkjzgcngsit6s",
    "sortOrder": 3
  },
  {
    "id": "cmrnbo5h60099kjzgg0f3ummc",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "addonPackageId": "cmrnbo5gm008wkjzg2pfdf59b",
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5h8009akjzgi2sfxvm2",
    "packageId": "cmrnbo5ff0072kjzgr2uxpv49",
    "addonPackageId": "cmrnbo5gt0091kjzgzhvaoaog",
    "sortOrder": 5
  },
  {
    "id": "cmrnbo5jz00bvkjzgpb0ag4ok",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "addonPackageId": "cmrnbo5iy00b6kjzgf7fn8eos",
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5k100bwkjzgc64rhnca",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "addonPackageId": "cmrnbo5j600bbkjzguj8enrzi",
    "sortOrder": 2
  },
  {
    "id": "cmrnbo5k300bxkjzgf52n0g7e",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "addonPackageId": "cmrnbo5jc00bgkjzgndwnbilj",
    "sortOrder": 3
  },
  {
    "id": "cmrnbo5k500bykjzgvr9hu9os",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "addonPackageId": "cmrnbo5jk00blkjzgnqpsmek9",
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5k800bzkjzgtvxski2m",
    "packageId": "cmrnbo5ig009skjzg9eqsa02x",
    "addonPackageId": "cmrnbo5js00bqkjzg38zdztrf",
    "sortOrder": 5
  },
  {
    "id": "cmrnbo5mv00ekkjzg58ae8l6u",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "addonPackageId": "cmrnbo5lv00dvkjzg1u1iee6n",
    "sortOrder": 1
  },
  {
    "id": "cmrnbo5mx00elkjzgvzhmr8ow",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "addonPackageId": "cmrnbo5m300e0kjzg1qfenj22",
    "sortOrder": 2
  },
  {
    "id": "cmrnbo5mz00emkjzgafmu8xfo",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "addonPackageId": "cmrnbo5ma00e5kjzg99cf7ygg",
    "sortOrder": 3
  },
  {
    "id": "cmrnbo5n100enkjzg63pm3zx0",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "addonPackageId": "cmrnbo5mi00eakjzgkmzblx2j",
    "sortOrder": 4
  },
  {
    "id": "cmrnbo5n300eokjzg82m8475k",
    "packageId": "cmrnbo5lg00chkjzga9n6eqhl",
    "addonPackageId": "cmrnbo5mp00efkjzgmte9bv8u",
    "sortOrder": 5
  }
];
const testimonialsData: any[] = [
  {
    "id": "cmrnbo4vb000ukjzgbfcfghts",
    "name": "Sarah Jenkins",
    "content": "An incredible journey through India. The guides were exceptional and every detail was perfectly arranged.",
    "imageId": "cmrnbo4py000bkjzgi6e977ao",
    "createdAt": "2026-07-16T09:44:17.063Z",
    "updatedAt": "2026-07-16T09:44:17.063Z"
  },
  {
    "id": "cmrngfpmu00010mf09hojfzhj",
    "name": "xsdcscasc",
    "content": "saxasx",
    "imageId": "cmrngfo6f00000mf0q1r94ew6",
    "createdAt": "2026-07-16T11:57:42.150Z",
    "updatedAt": "2026-07-16T11:58:11.927Z"
  },
  {
    "id": "cmrngg8eo00030mf0hxmsck5z",
    "name": "sc",
    "content": "saxas",
    "imageId": "cmrngg7l900020mf0to5d2ym0",
    "createdAt": "2026-07-16T11:58:06.480Z",
    "updatedAt": "2026-07-16T11:58:17.121Z"
  }
];

async function main() {
  console.log('Clearing old data...');
  await prisma.admin.deleteMany();
  await prisma.packageAddon.deleteMany();
  await prisma.packageGallery.deleteMany();
  await prisma.pricePackage.deleteMany();
  await prisma.departureDate.deleteMany();
  await prisma.bestSeason.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.goodToKnow.deleteMany();
  await prisma.localCuisine.deleteMany();
  await prisma.perfectFor.deleteMany();
  await prisma.seoMeta.deleteMany();
  await prisma.package.deleteMany();
  await prisma.country.deleteMany();
  await prisma.icon.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.image.deleteMany();

  console.log('Seeding admin...');
  const saltHex = crypto.randomBytes(16).toString('hex');
  const hashHex = crypto.scryptSync('admin123', saltHex, 64).toString('hex');
  const adminPasswordHash = `${saltHex}:${hashHex}`;
  await prisma.admin.create({
    data: {
      email: 'admin@escape.com',
      passwordHash: adminPasswordHash,
    },
  });

  console.log('Seeding images...');
  await prisma.image.createMany({
    data: imagesData.map(img => ({
      ...img,
      createdAt: new Date(img.createdAt),
      updatedAt: new Date(img.updatedAt),
    })),
  });

  console.log('Seeding icons...');
  await prisma.icon.createMany({
    data: iconsData.map(ic => ({
      ...ic,
      createdAt: new Date(ic.createdAt),
    })),
  });

  console.log('Seeding countries...');
  await prisma.country.createMany({
    data: countriesData.map(c => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    })),
  });

  console.log('Seeding packages...');
  await prisma.package.createMany({
    data: packagesData.map(p => ({
      ...p,
      type: p.type as PackageType,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    })),
  });

  console.log('Seeding seoMetas...');
  await prisma.seoMeta.createMany({
    data: seoMetasData,
  });

  console.log('Seeding itineraries...');
  await prisma.itinerary.createMany({
    data: itinerariesData.map(it => ({
      ...it,
      createdAt: new Date(it.createdAt),
    })),
  });

  console.log('Seeding experiences...');
  await prisma.experience.createMany({
    data: experiencesData.map(e => ({
      ...e,
      createdAt: new Date(e.createdAt),
    })),
  });

  console.log('Seeding hotels...');
  await prisma.hotel.createMany({
    data: hotelsData.map(h => ({
      ...h,
      createdAt: new Date(h.createdAt),
    })),
  });

  console.log('Seeding goodToKnows...');
  await prisma.goodToKnow.createMany({
    data: goodToKnowsData.map(g => ({
      ...g,
      createdAt: new Date(g.createdAt),
    })),
  });

  console.log('Seeding localCuisines...');
  await prisma.localCuisine.createMany({
    data: localCuisinesData.map(l => ({
      ...l,
      createdAt: new Date(l.createdAt),
    })),
  });

  console.log('Seeding perfectFors...');
  await prisma.perfectFor.createMany({
    data: perfectForsData.map(pf => ({
      ...pf,
      createdAt: new Date(pf.createdAt),
    })),
  });

  console.log('Seeding pricePackages...');
  await prisma.pricePackage.createMany({
    data: pricePackagesData.map(pp => ({
      ...pp,
      createdAt: new Date(pp.createdAt),
    })),
  });

  console.log('Seeding bestSeasons...');
  await prisma.bestSeason.createMany({
    data: (bestSeasonsData as any[]).map(bs => ({
      ...bs,
      month: bs.month as Month,
      type: bs.type as SeasonType,
    })),
  });

  console.log('Seeding departureDates...');
  await prisma.departureDate.createMany({
    data: (departureDatesData as any[]).map(dd => ({
      ...dd,
      departureDate: new Date(dd.departureDate),
      createdAt: new Date(dd.createdAt),
    })),
  });

  console.log('Seeding packageGalleries...');
  await prisma.packageGallery.createMany({
    data: (packageGalleriesData as any[]).map(pg => ({
      ...pg,
    })),
  });

  console.log('Seeding packageAddons...');
  await prisma.packageAddon.createMany({
    data: (packageAddonsData as any[]).map(pa => ({
      ...pa,
    })),
  });

  console.log('Seeding testimonials...');
  await prisma.testimonial.createMany({
    data: testimonialsData.map(t => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    })),
  });

  console.log('Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
