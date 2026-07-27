import type { Metadata } from 'next';
import { ITEMS, byId } from '@/lib/data';
import ItemDetail from './ItemDetail';

export const dynamicParams = false;

export function generateStaticParams() {
  return ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = byId(id);
  return { title: item ? item.dataType : 'รายละเอียดข้อมูล' };
}

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ItemDetail id={id} />;
}
