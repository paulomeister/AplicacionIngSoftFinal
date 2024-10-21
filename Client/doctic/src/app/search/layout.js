export default function layout({children}){
    return (
      <section className='d-flex flex-col justify-between w-full'>
        {children}
      </section>
    )
  }