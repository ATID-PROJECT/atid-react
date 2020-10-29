
import React from 'react';
import Header from 'components/header'

export default function Home() {
  return (
    <div>
      <section className={'m-vh-100'} style={styles.primaryLP}>
        <Header />
        <div style={styles.main}>
          <h2 className="text-white">Melhore seu desempenho.</h2>
          <div className="align-center">
            <hr style={styles.borderWhite} />
          </div>
          <p className="mt-2 text-white">A ATID possuí suporte para integração com a plataforma moodle.</p>
          <div className="mt-3">
            <a href="/" className="text-white white-outline-button">Como começar</a>
            <a href="/" className="text-white white-outline-button">Demonstração</a>
          </div>
          <div className="mt-4">
            <span className="border-sides" style={{color: '#DADADA'}}>ou</span>
          </div>
          <div className="mt-4">
            <a href="/" className="white-button">Assista nossos vídeos</a>
          </div>
        </div>
      </section>
      <section>
        <div className={'container'}>
          <div className={'row mt-2'}>
            <div className={'col-12 col-md-6 pr-md-5'}>
              <img src="/static/svg/teaching.svg" className="img-cover" alt="Ensinando" />
            </div>
            <div className="col-12 col-md-6 vertical-center">
              <h3>Um novo jeito de ensinar online</h3>
              <p>Para cada aluno, um caminho diferente. Que tal? Com a ATID você pode!</p>
              <ul style={styles.list}>
                <li>Crie diferentes caminhos de aprendizagem.</li>
                <li>Acompanhe o processo de avaliação.</li>
                <li>Altere qualquer coisa a qualquer momento.</li>
              </ul>
              <a href="/" className="primary-btn">Começar</a>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={'container'}>
          <div className={'row mt-7'}>
            <div className={'col-12 col-md-6 order-md-2 pr-md-5'}>
              <img src="/static/svg/logic.svg" className="img-cover" alt="Praticidade" />
            </div>
            <div className="col-12 col-md-6 vertical-center">
              <h3>Um novo jeito de ensinar online</h3>
              <p>Para cada aluno, um caminho diferente. Que tal? Com a ATID você pode!</p>
              <ul style={styles.list}>
                <li>Crie diferentes caminhos de aprendizagem.</li>
                <li>Acompanhe o processo de avaliação.</li>
                <li>Altere qualquer coisa a qualquer momento.</li>
              </ul>
              <a href="/" className="primary-btn">Começar</a>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={'container'}>
          <div className={'row mt-7'}>
            <div className={'col-12 col-md-6 pr-md-5'}>
              <img src="/static/svg/charts.svg" className="img-cover" alt="Gráficos" />
            </div>
            <div className="col-12 col-md-6 vertical-center">
              <h3>Um novo jeito de ensinar online</h3>
              <p>Para cada aluno, um caminho diferente. Que tal? Com a ATID você pode!</p>
              <ul style={styles.list}>
                <li>Crie diferentes caminhos de aprendizagem.</li>
                <li>Acompanhe o processo de avaliação.</li>
                <li>Altere qualquer coisa a qualquer momento.</li>
              </ul>
              <a href="/" className="primary-btn">Começar</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-dark" style={{height: 150}}>
        <div className="container">
          <div className="row mt-5">

          </div>
        </div>
      </section>
    </div>
  )
}

const styles = {
  primaryLP: {
    background: 'linear-gradient(0deg, rgba(33, 129, 159, 0.91),rgba(33, 129, 159, 0.91)),url(/static/img/cover.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  list: {
    paddingLeft: 15,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 56px)'
  },
  borderWhite: {
    marginTop: '0.5rem',
    marginBottom: '1rem',
    borderTop: '1px solid rgba(225, 225, 225, 0.28)',
    width: 420,
  }
}