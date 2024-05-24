import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Practice4GoodCCDomains1716531409199 implements MigrationInterface {
  name = 'Practice4GoodCCDomains1716531409199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: '_domains_practice_programs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'group',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: '_domains_civic_services',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'group',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`
        INSERT INTO _domains_practice_programs (name, "group") VALUES
        ('Advocacy', 'Advocacy'),
        ('Artă & Cultură', 'Artă & Cultură'),
        ('Tehnologie Civică', 'Tehnologie Civică'),
        ('Societatea Civilă - Participare Civică', 'Societatea Civilă'),
        ('Societatea Civilă - Comunitate', 'Societatea Civilă'),
        ('Societatea Civilă - Voluntariat', 'Societatea Civilă'),
        ('Dezvoltarea sectorului ONG', 'Dezvoltarea sectorului ONG'),
        ('Democrație', 'Democrație'),
        ('Democrație - Media', 'Democrație'),
        ('Democrație - Transparență', 'Democrație'),
        ('Intervenții În Caz De Dezastru', 'Intervenții în caz de dezastru'),
        ('Creștere Economică - Dezvoltare rurală', 'Creștere Economică'),
        ('Creștere Economică - Antreprenoriat social', 'Creștere Economică'),
        ('Creștere Economică - Dezvoltare urbană', 'Creștere Economică'),
        ('Educație', 'Educație'),
        ('Educație Digitală', 'Educație'),
        ('Educație - Învățare Continuă', 'Educație'),
        ('Educație Pentru Copiii cu CES', 'Educație'),
        ('Educație Incluzivă', 'Educație'),
        ('Mediu', 'Mediu'),
        ('Mediu - Animale și Faună sălbatică', 'Mediu'),
        ('Mediu - Combaterea Schimbărilor Climatice', 'Mediu'),
        ('Mediu - Agricultură Sustenabilă', 'Mediu'),
        ('Sănătate', 'Sănătate'),
        ('Sănătate - Intervenție de Urgență', 'Sănătate'),
        ('Sănătate - HIV/AIDS', 'Sănătate'),
        ('Sănătate Mentală', 'Sănătate'),
        ('Sănătate Fizică', 'Sănătate'),
        ('Sănătate Reproductivă', 'Sănătate'),
        ('Drepturile Omului', 'Drepturile Omului'),
        ('Drepturile Omului - Anti-Discriminare', 'Drepturile Omului'),
        ('Drepturile Omului - Copii', 'Drepturile Omului'),
        ('Drepturile Omului - Dizabilități', 'Drepturile Omului'),
        ('Drepturile Omului - Violență Domestică', 'Drepturile Omului'),
        ('Drepturile Omului - Egalitate de Gen', 'Drepturile Omului'),
        ('Drepturile Omului - LGBTQ+', 'Drepturile Omului'),
        ('Drepturile Omului - Minorități', 'Drepturile Omului'),
        ('Drepturile Omului - Refugiați', 'Drepturile Omului'),
        ('Drepturile Omului - Femei', 'Drepturile Omului'),
        ('Ajutor Umanitar', 'Ajutor umanitar'),
        ('Cooperare Internațională', 'Cooperare internațională'),
        ('Asistență Juridică', 'Asistență juridică'),
        ('Migrație', 'Asistență juridică'),
        ('Altceva/General', 'Altceva/General'),
        ('Filantropie', 'Filantropie'),
        ('Combaterea Sărăciei - Apă Curată', 'Combaterea sărăciei'),
        ('Combaterea Sărăciei - Securitate Alimentară', 'Combaterea sărăciei'),
        ('Combaterea Sărăciei - Locuințe Sigure', 'Combaterea sărăciei'),
        ('Cercetare', 'Cercetare'),
        ('Servicii Sociale', 'Servicii Sociale'),
        ('Sport', 'Sport');
    `);

    await queryRunner.query(`
    INSERT INTO _domains_civic_services (name, "group") VALUES
    ('Advocacy', 'Advocacy'),
    ('Artă & Cultură', 'Artă & Cultură'),
    ('Tehnologie Civică', 'Tehnologie Civică'),
    ('Societatea Civilă - Participare Civică', 'Societatea Civilă'),
    ('Societatea Civilă - Comunitate', 'Societatea Civilă'),
    ('Societatea Civilă - Voluntariat', 'Societatea Civilă'),
    ('Dezvoltarea sectorului ONG', 'Dezvoltarea sectorului ONG'),
    ('Democrație', 'Democrație'),
    ('Democrație - Media', 'Democrație'),
    ('Democrație - Transparență', 'Democrație'),
    ('Intervenții În Caz De Dezastru', 'Intervenții în caz de dezastru'),
    ('Creștere Economică - Dezvoltare rurală', 'Creștere Economică'),
    ('Creștere Economică - Antreprenoriat social', 'Creștere Economică'),
    ('Creștere Economică - Dezvoltare urbană', 'Creștere Economică'),
    ('Educație', 'Educație'),
    ('Educație Digitală', 'Educație'),
    ('Educație - Învățare Continuă', 'Educație'),
    ('Educație Pentru Copiii cu CES', 'Educație'),
    ('Educație Incluzivă', 'Educație'),
    ('Mediu', 'Mediu'),
    ('Mediu - Animale și Faună sălbatică', 'Mediu'),
    ('Mediu - Combaterea Schimbărilor Climatice', 'Mediu'),
    ('Mediu - Agricultură Sustenabilă', 'Mediu'),
    ('Sănătate', 'Sănătate'),
    ('Sănătate - Intervenție de Urgență', 'Sănătate'),
    ('Sănătate - HIV/AIDS', 'Sănătate'),
    ('Sănătate Mentală', 'Sănătate'),
    ('Sănătate Fizică', 'Sănătate'),
    ('Sănătate Reproductivă', 'Sănătate'),
    ('Drepturile Omului', 'Drepturile Omului'),
    ('Drepturile Omului - Anti-Discriminare', 'Drepturile Omului'),
    ('Drepturile Omului - Copii', 'Drepturile Omului'),
    ('Drepturile Omului - Dizabilități', 'Drepturile Omului'),
    ('Drepturile Omului - Violență Domestică', 'Drepturile Omului'),
    ('Drepturile Omului - Egalitate de Gen', 'Drepturile Omului'),
    ('Drepturile Omului - LGBTQ+', 'Drepturile Omului'),
    ('Drepturile Omului - Minorități', 'Drepturile Omului'),
    ('Drepturile Omului - Refugiați', 'Drepturile Omului'),
    ('Drepturile Omului - Femei', 'Drepturile Omului'),
    ('Ajutor Umanitar', 'Ajutor umanitar'),
    ('Cooperare Internațională', 'Cooperare internațională'),
    ('Asistență Juridică', 'Asistență juridică'),
    ('Migrație', 'Asistență juridică'),
    ('Altceva/General', 'Altceva/General'),
    ('Filantropie', 'Filantropie'),
    ('Combaterea Sărăciei - Apă Curată', 'Combaterea sărăciei'),
    ('Combaterea Sărăciei - Securitate Alimentară', 'Combaterea sărăciei'),
    ('Combaterea Sărăciei - Locuințe Sigure', 'Combaterea sărăciei'),
    ('Cercetare', 'Cercetare'),
    ('Servicii Sociale', 'Servicii Sociale'),
    ('Sport', 'Sport');
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('_domains_practice_programs');
    await queryRunner.dropTable('_domains_civic_services');
  }
}
