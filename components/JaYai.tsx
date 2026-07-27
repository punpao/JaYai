import Image from 'next/image';

/* จ่าใหญ่ — the mascot. Poses map onto the official sprite set in /public/poses. */

export type PoseName =
  | 'crossed' | 'thumbsSmall' | 'wave' | 'point' | 'thumbs' | 'waveHigh'
  | 'magnify' | 'think' | 'salute' | 'clipboard' | 'shield' | 'bulb';

const POSES: Record<PoseName, { src: string; w: number; h: number; alt: string }> = {
  crossed: { src: '/poses/pose_01.png', w: 194, h: 241, alt: 'จ่าใหญ่กอดอก' },
  thumbsSmall: { src: '/poses/pose_02.png', w: 218, h: 241, alt: 'จ่าใหญ่ยกนิ้วโป้ง' },
  wave: { src: '/poses/pose_03.png', w: 221, h: 241, alt: 'จ่าใหญ่โบกมือทักทาย' },
  point: { src: '/poses/pose_04.png', w: 194, h: 245, alt: 'จ่าใหญ่ชี้แนะนำ' },
  thumbs: { src: '/poses/pose_05.png', w: 218, h: 245, alt: 'จ่าใหญ่ยกนิ้วโป้งให้' },
  waveHigh: { src: '/poses/pose_06.png', w: 221, h: 245, alt: 'จ่าใหญ่ยกมือทักทาย' },
  magnify: { src: '/poses/pose_07.png', w: 194, h: 233, alt: 'จ่าใหญ่ส่องแว่นขยายตรวจข้อมูล' },
  think: { src: '/poses/pose_08.png', w: 218, h: 233, alt: 'จ่าใหญ่กอดอกครุ่นคิด' },
  salute: { src: '/poses/pose_09.png', w: 221, h: 233, alt: 'จ่าใหญ่ทำวันทยหัตถ์' },
  clipboard: { src: '/poses/pose_10.png', w: 194, h: 244, alt: 'จ่าใหญ่ถือแฟ้มรายงาน' },
  shield: { src: '/poses/pose_11.png', w: 218, h: 244, alt: 'จ่าใหญ่ถือโล่คุ้มครองข้อมูล' },
  bulb: { src: '/poses/pose_12.png', w: 221, h: 244, alt: 'จ่าใหญ่ชูหลอดไฟไอเดีย' },
};

export default function JaYai({
  pose,
  className = '',
  alt,
  priority = false,
}: {
  pose: PoseName;
  className?: string;
  /** override for context-specific alt text; pass '' when purely decorative */
  alt?: string;
  priority?: boolean;
}) {
  const p = POSES[pose];
  return (
    <Image
      src={p.src}
      width={p.w}
      height={p.h}
      alt={alt ?? p.alt}
      priority={priority}
      className={`jayai ${className}`.trim()}
    />
  );
}
