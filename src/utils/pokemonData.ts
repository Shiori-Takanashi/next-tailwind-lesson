import fs from 'fs';
import path from 'path';

export interface PokemonSpeciesData {
  base_happiness: number;
  capture_rate: number;
  color: {
    name: string;
    url: string;
  };
  egg_groups: Array<{
    name: string;
    url: string;
  }>;
  evolution_chain: {
    url: string;
  };
  evolves_from_species: any;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }>;
  generation: {
    name: string;
    url: string;
  };
  growth_rate: {
    name: string;
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  };
  has_gender_differences: boolean;
  hatch_counter: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  order: number;
  shape: {
    name: string;
    url: string;
  };
}

export const loadPokemonData = (id: number): PokemonSpeciesData | null => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'raw-species', `${id}.json`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading Pokemon data for ID ${id}:`, error);
    return null;
  }
};

export const loadAllPokemonIds = (): number[] => {
  try {
    const speciesDir = path.join(process.cwd(), 'data', 'raw-species');

    if (!fs.existsSync(speciesDir)) {
      return [];
    }

    const files = fs.readdirSync(speciesDir);
    const ids = files
      .filter(file => file.endsWith('.json'))
      .map(file => parseInt(file.replace('.json', ''), 10))
      .filter(id => !isNaN(id))
      .sort((a, b) => a - b);

    return ids;
  } catch (error) {
    console.error('Error loading Pokemon IDs:', error);
    return [];
  }
};
