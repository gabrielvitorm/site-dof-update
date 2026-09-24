type Sponsor = {
  name: string;
  logo?: string;
};

const sponsorGroups: Array<{ label: string; tone: string; sponsors: Sponsor[] }> = [
  {
    label: 'Patrocinadores',
    tone: 'primary',
    sponsors: [
      { name: 'Miotec', logo: '/sponsors/miotec.png' },
      { name: 'Quark', logo: '/sponsors/quark.png' },
      { name: 'Alphaon', logo: '/sponsors/alphaon.png' },
      { name: 'Dycon', logo: '/sponsors/dycon.png' },
      { name: 'Mmoptics', logo: '/sponsors/mmoptics.png' }
    ]
  },
  {
    label: 'Apoio',
    tone: 'secondary',
    sponsors: [
      { name: 'Abrafito', logo: '/sponsors/abrafito.png' },
      { name: 'CRO', logo: '/sponsors/cro.png' },
      { name: 'ABO', logo: '/sponsors/abo.png' },
      { name: 'Crefito', logo: '/sponsors/crefito.png' },
      { name: 'FAESA', logo: '/sponsors/faesa.png' }
    ]
  },
  {
    label: 'Realização do evento',
    tone: 'tertiary',
    sponsors: [
      { name: 'Ufes', logo: '/sponsors/ufes.png' },
      { name: 'Projeto Alívio', logo: '/sponsors/projeto-alivio.png' }
    ]
  }
];

export function SponsorsSection() {
  return (
    <section className="section sponsors-section sponsors-section-light" id="sponsors">
      <div className="section-intro">
        <p className="eyebrow">Quem faz acontecer</p>
        <h2>Uma imersão construída em rede</h2>
        <p>
          O DOF Update 2026 agradece às marcas e instituições que apoiam a realização deste encontro científico.
        </p>
      </div>

      <div className="sponsor-groups">
        {sponsorGroups.map((group) => (
          <div className={`sponsor-group sponsor-group-${group.tone}`} key={group.label}>
            <h3>{group.label}</h3>
            <div className="sponsor-grid">
              {group.sponsors.map((sponsor) => (
                <div
                  className="sponsor-card"
                  key={sponsor.name}
                >
                  {sponsor.logo ? (
                    <img
                      alt={`Logo ${sponsor.name}`}
                      height={120}
                      loading="lazy"
                      src={sponsor.logo}
                      width={240}
                    />
                  ) : (
                    <span className="sponsor-wordmark">{sponsor.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
