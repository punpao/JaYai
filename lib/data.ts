/* Mock seed data — fictional Thai organizations and the personal data they hold.
   This is a prototype: no real DSR API, no real companies. */

export type TierKey = 'high' | 'medium' | 'low';
export type FlowKind = 'collect' | 'store' | 'share' | 'broker';
export type IconName =
  | 'phone' | 'cart' | 'idcard' | 'contacts' | 'pin' | 'health' | 'sim' | 'bed'
  | 'profile' | 'mail' | 'building' | 'shield' | 'check' | 'send' | 'gear'
  | 'arrow' | 'eye' | 'alert' | 'trash' | 'db';

export interface Holder {
  id: string;
  name: string;
  type: string;
  en: string;
}

export interface FlowStep {
  kind: FlowKind;
  org: string;
  label: string;
  date: string;
}

export interface DataItem {
  id: string;
  dataType: string;
  icon: IconName;
  holder: string;
  score: number;
  tier: TierKey;
  lastActivity: string;
  risk: string;
  recommended: boolean;
  recommendReason?: string;
  flow: FlowStep[];
}

export const TIER: Record<TierKey, { key: TierKey; label: string; color: string }> = {
  high: { key: 'high', label: 'เสี่ยงสูง', color: 'var(--risk-high)' },
  medium: { key: 'medium', label: 'เสี่ยงปานกลาง', color: 'var(--risk-med)' },
  low: { key: 'low', label: 'เสี่ยงต่ำ', color: 'var(--risk-low)' },
};

export const HOLDERS: Record<string, Holder> = {
  shopmalee: { id: 'shopmalee', name: 'ช้อปมาลี', type: 'อีคอมเมิร์ซ', en: 'ShopMalee' },
  findee: { id: 'findee', name: 'ฟินดี เงินกู้ด่วน', type: 'สินเชื่อออนไลน์', en: 'FinDee Loan' },
  songwai: { id: 'songwai', name: 'ส่งไว เดลิเวอรี่', type: 'ฟู้ดเดลิเวอรี่', en: 'SongWai Delivery' },
  firmfit: { id: 'firmfit', name: 'เฟิร์มฟิต ฟิตเนส', type: 'ฟิตเนส (สมาชิกหมดอายุ)', en: 'FirmFit Fitness' },
  bigmart: { id: 'bigmart', name: 'บิ๊กมาร์ท', type: 'ซูเปอร์มาร์เก็ต', en: 'BigMart' },
  datalink: { id: 'datalink', name: 'ดาต้าลิงก์ อินไซต์', type: 'นายหน้าข้อมูล (Data Broker)', en: 'DataLink Insight' },
  connectel: { id: 'connectel', name: 'คอนเนคเทล', type: 'ค่ายมือถือเก่า (เลิกใช้ 3 ปี)', en: 'ConnecTel' },
  suksabai: { id: 'suksabai', name: 'โรงแรมสุขสบาย', type: 'โรงแรม', en: 'SukSabai Hotel' },
};

/* flow step kinds: collect → store → share → broker */
export const ITEMS: DataItem[] = [
  {
    id: 'contacts-findee',
    dataType: 'รายชื่อผู้ติดต่อทั้งเครื่อง',
    icon: 'contacts',
    holder: 'findee',
    score: 91,
    tier: 'high',
    lastActivity: 'แอปยังเปิดสิทธิ์เข้าถึงอยู่',
    risk: 'แอปกู้เงินดูดรายชื่อเพื่อนคุณไปทั้งเครื่องตั้งแต่วันสมัคร ถ้าข้อมูลชุดนี้หลุด เพื่อนกับครอบครัวคุณจะโดนแก๊งทวงหนี้และมิจฉาชีพโทรหาแทนคุณ ผมไม่ปล่อยผ่านแน่',
    recommended: true,
    recommendReason: 'ข้อมูลเกินความจำเป็นต่อการให้บริการ — ขอลบได้ทันที',
    flow: [
      { kind: 'collect', org: 'ฟินดี เงินกู้ด่วน', label: 'เก็บตอนขอสิทธิ์เข้าถึงเครื่อง', date: 'ม.ค. 2568' },
      { kind: 'store', org: 'เซิร์ฟเวอร์ฟินดี', label: 'เก็บถาวรในระบบประเมินสินเชื่อ', date: 'ม.ค. 2568' },
      { kind: 'share', org: 'บริษัททวงหนี้คู่สัญญา', label: 'ส่งต่อเมื่อผิดนัดชำระ', date: 'ตามสัญญา' },
    ],
  },
  {
    id: 'citizenid-findee',
    dataType: 'เลขบัตรประชาชน + สลิปเงินเดือน',
    icon: 'idcard',
    holder: 'findee',
    score: 88,
    tier: 'high',
    lastActivity: 'อัปโหลดตอน eKYC — ก.พ. 2568',
    risk: 'เลขบัตรกับสลิปเงินเดือนอยู่ในมือแอปกู้เงิน ถ้ารั่วไหลคนร้ายเอาไปเปิดบัญชีม้าหรือกู้เงินในชื่อคุณได้เลย ระดับนี้ผมให้เสี่ยงสูงสุด',
    recommended: true,
    recommendReason: 'ปิดบัญชีแล้วแต่ข้อมูลยังอยู่ — ใช้สิทธิ์ลบตาม PDPA ได้',
    flow: [
      { kind: 'collect', org: 'ฟินดี เงินกู้ด่วน', label: 'อัปโหลดผ่านขั้นตอน eKYC', date: 'ก.พ. 2568' },
      { kind: 'store', org: 'เซิร์ฟเวอร์ฟินดี', label: 'เก็บในระบบยืนยันตัวตน', date: 'ก.พ. 2568' },
      { kind: 'share', org: 'ผู้ให้บริการวิเคราะห์เครดิตภายนอก', label: 'ส่งไปประเมินความเสี่ยงสินเชื่อ', date: 'ก.พ. 2568' },
    ],
  },
  {
    id: 'profile-datalink',
    dataType: 'โปรไฟล์พฤติกรรมผู้บริโภค',
    icon: 'profile',
    holder: 'datalink',
    score: 95,
    tier: 'high',
    lastActivity: 'อัปเดตโปรไฟล์ล่าสุดเมื่อสัปดาห์ก่อน',
    risk: 'รายนี้คุณไม่เคยสมัครอะไรกับเขาเลย แต่เขารวบรวมข้อมูลคุณจากหลายเจ้ามาปั้นเป็นโปรไฟล์ขายต่อ นี่คือปลายทางที่ข้อมูลคุณไหลไปรวมกัน ต้องตัดวงจรที่ตรงนี้',
    recommended: true,
    recommendReason: 'นายหน้าข้อมูลที่คุณไม่เคยให้ความยินยอมโดยตรง — ควรลบเป็นรายการแรก',
    flow: [
      { kind: 'share', org: 'ช้อปมาลี', label: 'รับข้อมูลการซื้อ + เบอร์โทร', date: 'มี.ค. 2568' },
      { kind: 'share', org: 'บิ๊กมาร์ท', label: 'รับประวัติการซื้อจากบัตรสมาชิก', date: 'เม.ย. 2568' },
      { kind: 'broker', org: 'ดาต้าลิงก์ อินไซต์', label: 'รวมเป็นโปรไฟล์ ขายให้บริษัทโฆษณา', date: 'ต่อเนื่อง' },
    ],
  },
  {
    id: 'health-firmfit',
    dataType: 'ข้อมูลสุขภาพ + ผลตรวจร่างกาย',
    icon: 'health',
    holder: 'firmfit',
    score: 83,
    tier: 'high',
    lastActivity: 'สมาชิกหมดอายุตั้งแต่ปี 2567',
    risk: 'คุณเลิกเป็นสมาชิกยิมนี้ปีกว่าแล้ว แต่ผลตรวจสุขภาพยังค้างอยู่ในระบบเขา ข้อมูลสุขภาพเป็นข้อมูลอ่อนไหวตามกฎหมาย เก็บไว้โดยไม่มีเหตุจำเป็นไม่ได้',
    recommended: true,
    recommendReason: 'ความสัมพันธ์สิ้นสุดแล้ว — ไม่มีฐานให้เก็บข้อมูลอ่อนไหวต่อ',
    flow: [
      { kind: 'collect', org: 'เฟิร์มฟิต ฟิตเนส', label: 'ตรวจร่างกายก่อนเริ่มโปรแกรม', date: 'พ.ค. 2566' },
      { kind: 'store', org: 'ระบบสมาชิกเฟิร์มฟิต', label: 'ยังเก็บอยู่แม้สมาชิกหมดอายุ', date: 'ถึงปัจจุบัน' },
    ],
  },
  {
    id: 'citizenid-connectel',
    dataType: 'เลขบัตรประชาชน (ลงทะเบียนซิม)',
    icon: 'sim',
    holder: 'connectel',
    score: 79,
    tier: 'high',
    lastActivity: 'เลิกใช้เบอร์นี้มา 3 ปี',
    risk: 'ซิมเก่าที่คุณเลิกใช้ไป 3 ปี แต่เลขบัตรประชาชนยังนอนอยู่ในระบบเขา ยิ่งเก็บนานยิ่งเสี่ยงหลุดตอนระบบเก่าโดนเจาะ ของที่ไม่ใช้แล้วก็ควรขอคืน',
    recommended: true,
    recommendReason: 'เลิกใช้บริการนานแล้ว — เกินระยะเวลาจำเป็นในการเก็บ',
    flow: [
      { kind: 'collect', org: 'คอนเนคเทล', label: 'ลงทะเบียนซิมตามกฎ กสทช.', date: '2564' },
      { kind: 'store', org: 'คลังข้อมูลลูกค้าเก่า', label: 'ค้างอยู่ในระบบ archive', date: 'ถึงปัจจุบัน' },
    ],
  },
  {
    id: 'location-songwai',
    dataType: 'ประวัติตำแหน่งที่อยู่ย้อนหลัง',
    icon: 'pin',
    holder: 'songwai',
    score: 74,
    tier: 'high',
    lastActivity: 'ตามเก็บทุกครั้งที่เปิดแอป',
    risk: 'แอปส่งอาหารรู้ว่าบ้านคุณอยู่ไหน ที่ทำงานอยู่ไหน กลับบ้านกี่โมง แผนที่ชีวิตคุณทั้งใบอยู่ในมือเขา ถ้าหลุดไปถึงคนไม่หวังดีคือรู้ตัวตนคุณหมดเปลือก',
    recommended: false,
    flow: [
      { kind: 'collect', org: 'ส่งไว เดลิเวอรี่', label: 'เก็บพิกัดทุกครั้งที่สั่งอาหาร', date: 'ต่อเนื่อง' },
      { kind: 'store', org: 'ระบบวิเคราะห์เส้นทาง', label: 'เก็บย้อนหลัง 24 เดือน', date: 'ต่อเนื่อง' },
      { kind: 'share', org: 'พาร์ตเนอร์โฆษณาตามพื้นที่', label: 'ส่งพิกัดแบบสรุปให้ผู้ลงโฆษณา', date: 'รายเดือน' },
    ],
  },
  {
    id: 'passport-suksabai',
    dataType: 'สำเนาบัตรประชาชน (เช็คอิน)',
    icon: 'idcard',
    holder: 'suksabai',
    score: 68,
    tier: 'medium',
    lastActivity: 'เข้าพักล่าสุด ธ.ค. 2568',
    risk: 'โรงแรมถ่ายสำเนาบัตรตอนเช็คอินแล้วเก็บเป็นไฟล์สแกนไว้ ถ้าระบบเขาโดนเจาะ สำเนาบัตรคุณพร้อมลายเซ็นจะไปโผล่ในตลาดมืด อันนี้ต้องจับตา',
    recommended: false,
    flow: [
      { kind: 'collect', org: 'โรงแรมสุขสบาย', label: 'สแกนบัตรตอนเช็คอิน', date: 'ธ.ค. 2568' },
      { kind: 'store', org: 'ระบบจองของโรงแรม', label: 'เก็บไฟล์สแกนในระบบ', date: 'ถึงปัจจุบัน' },
    ],
  },
  {
    id: 'phone-shopmalee',
    dataType: 'เบอร์โทรศัพท์',
    icon: 'phone',
    holder: 'shopmalee',
    score: 62,
    tier: 'medium',
    lastActivity: 'ใช้งานบัญชีอยู่',
    risk: 'เบอร์คุณถูกส่งต่อจากร้านค้าไปถึงนายหน้าข้อมูลแล้วหนึ่งทอด นี่แหละต้นตอสายแปลก ๆ ที่โทรมาขายของ ถ้าเบื่อรับสายมิจฉาชีพ ต้องตัดตั้งแต่ต้นทาง',
    recommended: false,
    flow: [
      { kind: 'collect', org: 'ช้อปมาลี', label: 'กรอกตอนสมัครสมาชิก', date: '2566' },
      { kind: 'store', org: 'ระบบสมาชิกช้อปมาลี', label: 'ใช้ยืนยัน OTP และแจ้งสถานะ', date: 'ต่อเนื่อง' },
      { kind: 'broker', org: 'ดาต้าลิงก์ อินไซต์', label: 'ถูกส่งต่อเพื่อการตลาด', date: 'มี.ค. 2568' },
    ],
  },
  {
    id: 'purchase-shopmalee',
    dataType: 'ประวัติการซื้อสินค้า',
    icon: 'cart',
    holder: 'shopmalee',
    score: 55,
    tier: 'medium',
    lastActivity: 'สั่งซื้อล่าสุดเดือนนี้',
    risk: 'ทุกออเดอร์ที่คุณกดสั่งถูกจดไว้หมด และถูกส่งไปให้นายหน้าข้อมูลปั้นโปรไฟล์นิสัยการใช้เงินของคุณ ไม่อันตรายเฉียบพลัน แต่โดนรู้ใจเกินไปก็ไม่ใช่เรื่องดี',
    recommended: false,
    flow: [
      { kind: 'collect', org: 'ช้อปมาลี', label: 'บันทึกทุกคำสั่งซื้อ', date: 'ต่อเนื่อง' },
      { kind: 'broker', org: 'ดาต้าลิงก์ อินไซต์', label: 'ส่งต่อเพื่อวิเคราะห์พฤติกรรม', date: 'มี.ค. 2568' },
    ],
  },
  {
    id: 'purchase-bigmart',
    dataType: 'ประวัติการซื้อ (บัตรสมาชิก)',
    icon: 'cart',
    holder: 'bigmart',
    score: 41,
    tier: 'medium',
    lastActivity: 'สแกนบัตรล่าสุดสัปดาห์ก่อน',
    risk: 'บัตรสะสมแต้มจดไว้หมดว่าคุณซื้ออะไรกินอะไร เขาส่งข้อมูลแบบสรุปไปให้นายหน้าข้อมูลด้วย ยังไม่ร้ายแรง แต่ผมบันทึกไว้ในแฟ้มแล้ว',
    recommended: false,
    flow: [
      { kind: 'collect', org: 'บิ๊กมาร์ท', label: 'สแกนบัตรสมาชิกที่แคชเชียร์', date: 'ต่อเนื่อง' },
      { kind: 'share', org: 'ดาต้าลิงก์ อินไซต์', label: 'ส่งข้อมูลแบบสรุปรายเดือน', date: 'รายเดือน' },
    ],
  },
  {
    id: 'phone-bigmart',
    dataType: 'เบอร์โทรศัพท์',
    icon: 'phone',
    holder: 'bigmart',
    score: 38,
    tier: 'low',
    lastActivity: 'ใช้สะสมแต้มอยู่',
    risk: 'เบอร์นี้ใช้แค่สะสมแต้ม เขาเก็บไว้ในระบบสมาชิกอย่างเดียว ยังไม่พบการส่งต่อ ความเสี่ยงต่ำ แต่ผมยังเฝ้าอยู่นะ',
    recommended: false,
    flow: [
      { kind: 'collect', org: 'บิ๊กมาร์ท', label: 'สมัครบัตรสมาชิกที่สาขา', date: '2567' },
      { kind: 'store', org: 'ระบบสมาชิกบิ๊กมาร์ท', label: 'ใช้ค้นหาบัญชีแต้ม', date: 'ต่อเนื่อง' },
    ],
  },
  {
    id: 'email-shopmalee',
    dataType: 'อีเมล',
    icon: 'mail',
    holder: 'shopmalee',
    score: 25,
    tier: 'low',
    lastActivity: 'รับใบเสร็จทางอีเมลอยู่',
    risk: 'อีเมลใช้รับใบเสร็จกับข่าวโปรโมชัน ยังไม่พบการส่งต่อไปไหน ความเสี่ยงต่ำสุดในแฟ้มของคุณ สบายใจได้ระดับหนึ่ง',
    recommended: false,
    flow: [
      { kind: 'collect', org: 'ช้อปมาลี', label: 'กรอกตอนสมัครสมาชิก', date: '2566' },
      { kind: 'store', org: 'ระบบสมาชิกช้อปมาลี', label: 'ใช้ส่งใบเสร็จ/โปรโมชัน', date: 'ต่อเนื่อง' },
    ],
  },
  {
    id: 'stay-suksabai',
    dataType: 'ประวัติการเข้าพัก',
    icon: 'bed',
    holder: 'suksabai',
    score: 33,
    tier: 'low',
    lastActivity: 'เข้าพักล่าสุด ธ.ค. 2568',
    risk: 'ประวัติว่าคุณพักที่ไหนเมื่อไหร่ เก็บไว้ในระบบจองของโรงแรมเอง ไม่พบการส่งต่อ ความเสี่ยงต่ำ แต่ถ้าจะลบพร้อมสำเนาบัตรก็จัดชุดเดียวกันได้',
    recommended: false,
    flow: [
      { kind: 'collect', org: 'โรงแรมสุขสบาย', label: 'บันทึกตอนจองและเช็คอิน', date: 'ธ.ค. 2568' },
      { kind: 'store', org: 'ระบบจองของโรงแรม', label: 'เก็บประวัติการเข้าพัก', date: 'ถึงปัจจุบัน' },
    ],
  },
];

export const byId = (id: string) => ITEMS.find((i) => i.id === id);
export const holderOf = (item: DataItem) => HOLDERS[item.holder];
export const tierOf = (item: DataItem) => TIER[item.tier];
