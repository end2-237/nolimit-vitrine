import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Les tables de l'app vivent dans le schéma `nolimit`, et la plupart des
// requêtes utilisent des noms NON qualifiés (site_media, maladies,
// reservations, commandes, contact_messages, ...). On force donc le
// search_path à chaque nouvelle connexion du pool pour qu'elles soient
// résolues dans `nolimit` (puis `public` en repli). Les requêtes déjà
// qualifiées (nolimit.products, nolimit.site_config) restent valides.
pool.on('connect', (client) => {
  client.query('SET search_path TO nolimit, public').catch(() => {});
});
