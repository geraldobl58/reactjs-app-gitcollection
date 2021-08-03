import React from 'react';

import { FiChevronRight } from 'react-icons/fi';

import { Title, Form, Repos } from './styles';

import logo from '../../assets/logo.svg';

export const Dashboard: React.FC = () => {
  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogo de repositórios do Github</Title>

      <Form>
        <input placeholder="username/repository_name" />
        <button type="submit">Buscar</button>
      </Form>

      <Repos>
        <a href="/repositories">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
            alt="Repositórios"
          />
          <div>
            <strong>geraldobl58/wongames-client</strong>
            <p>
              Este é um boilerplate Next.js que foi desenvolvido no curso de
              React Avançado.
            </p>
          </div>
          <FiChevronRight size={20} />
        </a>
      </Repos>
    </>
  );
};

export default Dashboard;
