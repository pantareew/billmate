type Props = {
  params: { id: string };
};

export default function BillPage({ params }: Props) {
  return <div>Bill ID: {params.id}</div>;
}
