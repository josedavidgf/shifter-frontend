import { Toaster } from 'react-hot-toast';

export default function GlobalUI() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          className: '', // ← Aquí dejamos vacío porque aplicaremos por llamada
        }}
      />
        {/* Aquí puedes agregar otros componentes globales, como un Footer o un Header */}
        {/* <Footer /> */}
        {/* <Header /> */}
    </>
  );
}
