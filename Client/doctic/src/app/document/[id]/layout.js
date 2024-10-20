export default function layout({children}){
  return (
    <section className='d-flex flex-col justify-between'>
      {children}
    </section>
  )
}