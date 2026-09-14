export interface AudienceItem {
  title: string;
  description: string;
}

export interface ScientificPillar {
  title: string;
  description: string;
  focus: string;
}

export interface ProgramBlock {
  date: string;
  title: string;
  time: string;
  description: string;
  agenda: string[];
}

export interface SpeakerPlaceholder {
  name: string;
  specialty: string;
  bio: string;
  topic: string;
  image: string | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const eventContent = {
  name: 'DOF Update 2026',
  edition: 'III Imersao Interprofissional em DTM e Dores Orofaciais',
  promise: 'Uma imersao interprofissional para transformar evidencia cientifica em decisoes clinicas mais seguras.',
  intro:
    'Um encontro presencial para profissionais que desejam aprofundar sua atuacao em Disfuncoes Temporomandibulares, Dores Orofaciais, Sono e abordagens interprofissionais.',
  date: '03 de outubro de 2026',
  time: '7h30 as 18h45',
  venue: 'Auditorio da FAESA',
  city: 'Vitoria, ES',
  price: 'R$ 320',
  lot: 'Ultimo lote',
  format: '100% presencial',
  noRecording: 'Nao havera transmissao online nem disponibilizacao posterior das palestras.',
  themes: ['DTM', 'Dor Orofacial', 'Sono', 'Neurofisiologia', 'Farmacologia', 'Pratica Clinica'],
  primaryCta: 'Garantir minha vaga',
  whyParticipate:
    'DTM, dores orofaciais e disturbios relacionados ao sono envolvem condicoes complexas e multifatoriais. O DOF Update 2026 aproxima diferentes areas da saude em torno de um mesmo objetivo: compreender melhor o paciente e tomar decisoes clinicas mais seguras, atuais e fundamentadas em evidencias.',
  audience: [
    {
      title: 'Cirurgioes-dentistas',
      description:
        'Para profissionais que atuam ou desejam aprofundar seus conhecimentos em DTM, dor orofacial, sono, diagnostico e manejo de pacientes com quadros complexos.'
    },
    {
      title: 'Fisioterapeutas',
      description:
        'Para quem acompanha pacientes com dor musculoesqueletica, alteracoes funcionais, DTM e condicoes cronicas.'
    },
    {
      title: 'Fonoaudiologos e Audiologia',
      description:
        'Para profissionais que lidam com funcoes orofaciais, mastigacao, degluticao, sono e sintomas que podem estar associados a DTM.'
    },
    {
      title: 'Medicos',
      description:
        'Para profissionais interessados na compreensao multidimensional da dor, sono, farmacologia, diagnostico diferencial e manejo integrado.'
    },
    {
      title: 'Estudantes e profissionais em formacao',
      description:
        'Para quem deseja contato com uma abordagem atual e baseada em evidencias desde o inicio da formacao.'
    }
  ] satisfies AudienceItem[],
  pillars: [
    {
      title: 'Diagnostico e DTM',
      description: 'Avaliacao clinica, criterios diagnosticos e tomada de decisao em casos de DTM.',
      focus: 'Raciocinio clinico, diagnostico diferencial e escolha de condutas.'
    },
    {
      title: 'Dor Orofacial e Neurofisiologia',
      description: 'Mecanismos envolvidos na dor e como esse conhecimento influencia a abordagem clinica.',
      focus: 'Dor aguda e cronica, sensibilizacao e manejo de quadros complexos.'
    },
    {
      title: 'Sono e Dor Cronica',
      description: 'Visao integrada sobre sono, dor e condicoes que impactam a qualidade de vida.',
      focus: 'Disturbios do sono, dor persistente e abordagem interprofissional.'
    },
    {
      title: 'Farmacologia e Tratamentos Contemporaneos',
      description: 'Recursos terapeuticos e estrategias utilizadas no manejo da dor orofacial.',
      focus: 'Indicacoes, limites e aplicabilidade clinica baseada em evidencias.'
    },
    {
      title: 'Cuidado Interprofissional',
      description: 'Como diferentes areas podem contribuir para o cuidado do mesmo paciente.',
      focus: 'Integracao, comunicacao clinica, encaminhamento e redes profissionais.'
    }
  ] satisfies ScientificPillar[],
  program: [
    {
      date: '02 de outubro de 2026',
      title: 'Workshop de Tecnologias para Dor',
      time: '18h30 as 20h30',
      description:
        'Uma experiencia pratica e demonstrativa voltada para tecnologias e tratamentos adjuvantes utilizados no manejo da dor.',
      agenda: [
        '18h30 - Abertura e apresentacao',
        '[HORARIO] - [TEMA / TECNOLOGIA] - [PALESTRANTE / SPEAKER]',
        '[HORARIO] - [TEMA / TECNOLOGIA] - [PALESTRANTE / SPEAKER]',
        '20h30 - Encerramento'
      ]
    },
    {
      date: '03 de outubro de 2026',
      title: 'III Imersao Interprofissional em DTM e Dores Orofaciais',
      time: '7h30 as 18h45',
      description:
        'Um dia inteiro de atualizacao cientifica e discussao clinica com diferentes especialidades reunidas em torno de DTM, dores orofaciais, sono e cuidado interprofissional.',
      agenda: [
        '07h30 - Credenciamento',
        '[HORARIO] - [TITULO DA PALESTRA] - [PALESTRANTE 01]',
        '[HORARIO] - Intervalo',
        '[HORARIO] - [PALESTRA / MESA / DISCUSSAO]',
        '18h45 - Encerramento'
      ]
    }
  ] satisfies ProgramBlock[],
  speakers: Array.from({ length: 6 }, (_, index) => ({
    name: `[PALESTRANTE ${String(index + 1).padStart(2, '0')}]`,
    specialty: '[ESPECIALIDADE / TITULACAO]',
    bio: '[MINI BIO]',
    topic: '[TEMA]',
    image: null
  })) satisfies SpeakerPlaceholder[],
  differentiators: [
    'Ciencia conectada a realidade clinica',
    'Diferentes especialidades no mesmo ambiente',
    'Espaco para troca, perguntas e conexoes profissionais',
    'Experiencia exclusivamente presencial',
    'Conteudo ao vivo, sem gravacao posterior'
  ],
  workshopNotice:
    'A inscricao no DOF Update 2026 nao garante automaticamente uma vaga no workshop. Para participar, e necessario estar inscrito no evento principal e realizar uma inscricao especifica.',
  groupOffer: {
    title: 'Condicoes especiais para grupos',
    items: ['5 participantes - 10% de desconto', '10 participantes - 15% de desconto'],
    cta: 'Quero saber sobre inscricoes em grupo'
  },
  location: {
    title: 'Onde acontece o DOF Update 2026',
    address: '[ENDERECO COMPLETO DA FAESA]',
    guidance:
      'Planeje deslocamento, hospedagem e estacionamento com antecedencia. Nao listamos hoteis especificos enquanto nao houver recomendacao oficial verificada.'
  },
  faqs: [
    {
      question: 'Quando acontece o DOF Update 2026?',
      answer:
        'O evento principal acontece em 03 de outubro de 2026, das 7h30 as 18h45, no Auditorio da FAESA, em Vitoria/ES.'
    },
    {
      question: 'O evento e presencial?',
      answer: 'Sim. O DOF Update 2026 e 100% presencial e nao tera transmissao online.'
    },
    {
      question: 'Qual e o valor da inscricao?',
      answer: 'O evento esta no ultimo lote, com inscricao informada no valor de R$ 320, sujeito a disponibilidade.'
    },
    {
      question: 'O pagamento e feito nesta pagina?',
      answer: 'Nao. O pagamento e concluido na plataforma oficial de inscricao, Even3.'
    },
    {
      question: 'A inscricao no evento inclui o workshop?',
      answer:
        'Nao. O Workshop de Tecnologias para Dor possui inscricao especifica e vagas limitadas.'
    }
  ] satisfies FaqItem[]
};
