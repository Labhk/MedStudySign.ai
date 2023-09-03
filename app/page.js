import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="mr-4">
        <Image src="/signature.gif" alt="Signature" width={300} height={200} />
      </div>
      <div className='text-6xl font-extrabold text-teal-500 '>
        MedStudySign.ai
      </div>
    </main>
  )
}
