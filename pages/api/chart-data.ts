export default async function handler(
  req: any,
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: any): void; new (): any };
    };
  },
) {
  const apiUrl =
    "https://data.taipei/api/v1/dataset/8f690548-61bc-4bff-8baa-01d465eb672c?scope=resourceAquire";
  const response = await fetch(apiUrl);
  const data = await response.json();
  res.status(200).json(data);
}
