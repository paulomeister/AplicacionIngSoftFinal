export default function layout({children}){
  return (
    <section className='container flex flex-col justify-between space-y-6'>
      {children}
    </section>
  )
}