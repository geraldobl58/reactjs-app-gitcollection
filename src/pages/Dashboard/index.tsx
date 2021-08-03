import React, { useState, useEffect } from 'react';

import { FiChevronRight } from 'react-icons/fi';

import { Title, Form, Repos, Error } from './styles';

import logo from '../../assets/logo.svg';
import { api } from '../../services/api';

export type GithubRepositoryProps = {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
};

export const Dashboard: React.FC = () => {
  const [repository, setRepository] = useState<GithubRepositoryProps[]>(() => {
    const storageRepos = localStorage.getItem('@GitCollection:repositories');

    if (storageRepos) {
      return JSON.parse(storageRepos);
    }

    return [];
  });
  const [newRepository, setNewRepository] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@GitCollection:repositories',
      JSON.stringify(repository),
    );
  }, [repository]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setNewRepository(event.target.value);
  }

  async function handleAddRepository(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepository) {
      setInputError('Informe o username/repositório');
      return;
    }

    const response = await api.get<GithubRepositoryProps>(
      `/repos/${newRepository}`,
    );

    const repositories = response.data;

    setRepository([...repository, repositories]);
    setNewRepository('');
  }

  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogo de repositórios do Github</Title>

      <Form onSubmit={handleAddRepository} hasError={Boolean(inputError)}>
        <input
          placeholder="username/repository_name"
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repos>
        {repository.map(repo => (
          <a href="/repositories" key={repo.full_name}>
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repos>
    </>
  );
};

export default Dashboard;
