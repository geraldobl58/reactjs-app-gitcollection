import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { FiChevronRight } from 'react-icons/fi';

import { api } from '../../services/api';

import { Title, Form, Repos, Error } from './styles';

import logo from '../../assets/logo.svg';

export type GithubRepositoryProps = {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
};

const Dashboard: React.FC = () => {
  const [repository, setRepository] = useState<GithubRepositoryProps[]>(() => {
    const storageRepos = localStorage.getItem('@GitCollection:repositories');

    if (storageRepos) {
      return JSON.parse(storageRepos);
    }

    return [];
  });
  const [newRepository, setNewRepository] = useState('');
  const [inputError, setInputError] = useState('');
  const formEl = useRef<HTMLFormElement | null>(null);

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

    try {
      const response = await api.get<GithubRepositoryProps>(
        `/repos/${newRepository}`,
      );

      const repositories = response.data;

      setRepository([...repository, repositories]);
      formEl.current?.reset();
      setNewRepository('');
      setInputError('');
    } catch {
      setInputError('reposiório não encontrado!');
    }
  }

  return (
    <>
      <img src={logo} alt="GitCollection" />
      <Title>Catálogo de repositórios do Github</Title>

      <Form
        ref={formEl}
        onSubmit={handleAddRepository}
        hasError={Boolean(inputError)}
      >
        <input
          placeholder="username/repository_name"
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repos>
        {repository.map((repo, index) => (
          <Link
            to={`/repositories/${repo.full_name}`}
            key={repo.full_name + index}
          >
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repos>
    </>
  );
};

export default Dashboard;
