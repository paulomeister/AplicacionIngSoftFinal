export default function layout({children}){
  return (
    <section className='d-flex flex-col justify-between space-y-6 w-[1200px]'>
      {children}
    </section>
  )
}