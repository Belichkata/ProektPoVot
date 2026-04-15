const ROOT_ID = "Music";

const track = (artist, title, query) => ({
  artist,
  title,
  query: query || `${artist} ${title}`
});

const pool = (items) =>
  items.split(";").map((item) => {
    const [artist, title] = item.split("|");
    return track(artist, title);
  });

const samplePools = {
  Music: pool("Marvin Gaye|What's Going On;Daft Punk|Around the World;Nina Simone|Feeling Good;The Beatles|Come Together"),
  Rock: pool("The Beatles|Come Together;Led Zeppelin|Whole Lotta Love;Nirvana|Smells Like Teen Spirit;Radiohead|Paranoid Android;The Clash|London Calling;Queen|Bohemian Rhapsody;Pink Floyd|Money;The Strokes|Last Nite"),
  Metal: pool("Black Sabbath|Iron Man;Iron Maiden|The Trooper;Metallica|Master of Puppets;Slayer|Raining Blood;Judas Priest|Breaking the Law;Pantera|Walk;Death|Pull the Plug;Mayhem|Freezing Moon;Meshuggah|Bleed;Opeth|Ghost of Perdition"),
  "Punk and Hardcore": pool("Ramones|Blitzkrieg Bop;Sex Pistols|Anarchy in the U.K.;Black Flag|Rise Above;Minor Threat|Straight Edge;Bad Brains|Banned in D.C.;Fugazi|Waiting Room;Green Day|Basket Case;Turnstile|Mystery"),
  Pop: pool("Michael Jackson|Billie Jean;Madonna|Like a Prayer;ABBA|Dancing Queen;Britney Spears|Toxic;Lady Gaga|Bad Romance;Carly Rae Jepsen|Run Away With Me;BTS|Dynamite;Dua Lipa|Levitating;Taylor Swift|Style;Charli XCX|Vroom Vroom"),
  "Hip Hop": pool("Grandmaster Flash|The Message;Nas|N.Y. State of Mind;2Pac|California Love;OutKast|Ms. Jackson;Kendrick Lamar|HUMBLE.;Missy Elliott|Work It;Migos|Bad and Boujee;Chief Keef|Love Sosa;A Tribe Called Quest|Electric Relaxation;Wu-Tang Clan|C.R.E.A.M."),
  Electronic: pool("Daft Punk|Around the World;Kraftwerk|The Robots;The Chemical Brothers|Galvanize;Aphex Twin|Windowlicker;Fatboy Slim|Praise You;Justice|D.A.N.C.E.;Avicii|Levels;deadmau5|Strobe;Burial|Archangel;Skrillex|Scary Monsters and Nice Sprites"),
  "Dance and Club": pool("Technotronic|Pump Up the Jam;Stardust|Music Sounds Better With You;Robin S|Show Me Love;Darude|Sandstorm;Major Lazer|Lean On;DJ Snake|Turn Down for What;Kaytranada|Lite Spots;Peggy Gou|It Makes You Forget"),
  Jazz: pool("Miles Davis|So What;Dave Brubeck|Take Five;John Coltrane|Giant Steps;Duke Ellington|Take the A Train;Thelonious Monk|Round Midnight;Herbie Hancock|Chameleon;Billie Holiday|Strange Fruit;Weather Report|Birdland"),
  Classical: pool("Johann Sebastian Bach|Cello Suite No. 1;Wolfgang Amadeus Mozart|Eine kleine Nachtmusik;Ludwig van Beethoven|Symphony No. 5;Antonio Vivaldi|The Four Seasons;Claude Debussy|Clair de Lune;Igor Stravinsky|The Rite of Spring;Philip Glass|Glassworks;Pyotr Ilyich Tchaikovsky|Swan Lake"),
  "R&B and Soul": pool("Aretha Franklin|Respect;Marvin Gaye|What's Going On;Stevie Wonder|Superstition;James Brown|I Got You;Prince|Kiss;D'Angelo|Untitled;Sade|No Ordinary Love;Mary J. Blige|Family Affair;TLC|No Scrubs"),
  "Reggae and Caribbean": pool("Bob Marley|One Love;Toots and the Maytals|54-46 Was My Number;Desmond Dekker|Israelites;King Tubby|King Tubby Meets Rockers Uptown;Sister Nancy|Bam Bam;Sean Paul|Get Busy;Jimmy Cliff|Many Rivers to Cross"),
  "Country and Folk": pool("Johnny Cash|Folsom Prison Blues;Dolly Parton|Jolene;Willie Nelson|On the Road Again;Hank Williams|Your Cheatin' Heart;The Carter Family|Wildwood Flower;Alison Krauss|Down to the River to Pray;Bob Dylan|Blowin' in the Wind"),
  Latin: pool("Celia Cruz|La Vida Es Un Carnaval;Buena Vista Social Club|Chan Chan;Tito Puente|Oye Como Va;Joao Gilberto|Desafinado;Stan Getz|The Girl from Ipanema;Daddy Yankee|Gasolina;Shakira|Hips Don't Lie;Juan Luis Guerra|Bachata Rosa"),
  Blues: pool("Robert Johnson|Cross Road Blues;Muddy Waters|Hoochie Coochie Man;B.B. King|The Thrill Is Gone;Howlin' Wolf|Smokestack Lightning;Etta James|I'd Rather Go Blind;John Lee Hooker|Boom Boom"),
  "World and Regional": pool("Fela Kuti|Zombie;Miriam Makeba|Pata Pata;Ali Farka Toure|Ai Du;Nusrat Fateh Ali Khan|Mustt Mustt;Ravi Shankar|Raga Jog;A. R. Rahman|Jai Ho;Youssou N'Dour|7 Seconds;Tinariwen|Sastanaqqam"),
  Experimental: pool("Brian Eno|1/1;Throbbing Gristle|Hamburger Lady;Merzbow|Pulse Demon;Steve Reich|Music for 18 Musicians;Laurie Anderson|O Superman;Karlheinz Stockhausen|Kontakte;Autechre|Gantz Graf;Tim Hecker|Chimeras"),
  "New Age and Spiritual": pool("Enya|Orinoco Flow;Yanni|Santorini;George Winston|Thanksgiving;Kitaro|Silk Road;Vangelis|Chariots of Fire;Deuter|Temple of Silence;Loreena McKennitt|The Mummers' Dance;Krishna Das|Baba Hanuman"),
  "Stage and Screen": pool("John Williams|Star Wars Main Title;Hans Zimmer|Time;Lin-Manuel Miranda|My Shot;Andrew Lloyd Webber|The Phantom of the Opera;Alan Menken|A Whole New World;Koji Kondo|Super Mario Bros. Theme;Yoko Kanno|Tank!"),
  Gospel: pool("Mahalia Jackson|How I Got Over;Kirk Franklin|Stomp;The Staple Singers|I'll Take You There;Sister Rosetta Tharpe|Didn't It Rain;Aretha Franklin|Amazing Grace;The Clark Sisters|You Brought the Sunshine")
};

const sampleOverrides = Object.fromEntries(
  [
    ["House", "Frankie Knuckles|Your Love"],
    ["Deep House", "Larry Heard|Can You Feel It"],
    ["Techno", "Derrick May|Strings of Life"],
    ["Trance", "Robert Miles|Children"],
    ["Drum and Bass", "Goldie|Inner City Life"],
    ["Jungle", "Shy FX|Original Nuttah"],
    ["Dubstep", "Skream|Midnight Request Line"],
    ["UK Garage", "DJ Luck and MC Neat|A Little Bit of Luck"],
    ["Ambient", "Brian Eno|An Ending"],
    ["IDM", "Aphex Twin|Xtal"],
    ["Trap", "T.I.|What You Know"],
    ["Drill", "Chief Keef|Love Sosa"],
    ["Grime", "Wiley|Wot Do U Call It?"],
    ["Lo-fi Hip Hop", "Nujabes|Feather"],
    ["Rock and Roll", "Chuck Berry|Johnny B. Goode"],
    ["Classic Rock", "Led Zeppelin|Rock and Roll"],
    ["Punk Rock", "Ramones|Blitzkrieg Bop"],
    ["Grunge", "Nirvana|Smells Like Teen Spirit"],
    ["Shoegaze", "My Bloody Valentine|Only Shallow"],
    ["Heavy Metal", "Black Sabbath|Paranoid"],
    ["Thrash Metal", "Metallica|Battery"],
    ["Death Metal", "Death|Pull the Plug"],
    ["Black Metal", "Mayhem|Freezing Moon"],
    ["Metalcore", "Killswitch Engage|My Curse"],
    ["Synthpop", "Depeche Mode|Enjoy the Silence"],
    ["K-Pop", "BTS|Dynamite"],
    ["J-Pop", "Hikaru Utada|First Love"],
    ["Hyperpop", "SOPHIE|Immaterial"],
    ["Dance Pop", "Lady Gaga|Bad Romance"],
    ["Art Pop", "Kate Bush|Running Up That Hill"],
    ["Bebop", "Charlie Parker|Ko-Ko"],
    ["Swing", "Benny Goodman|Sing, Sing, Sing"],
    ["Free Jazz", "Ornette Coleman|Lonely Woman"],
    ["Jazz Fusion", "Weather Report|Birdland"],
    ["Baroque", "Johann Sebastian Bach|Brandenburg Concerto No. 3"],
    ["Romantic", "Frederic Chopin|Nocturne Op. 9 No. 2"],
    ["Opera", "Giacomo Puccini|Nessun Dorma"],
    ["Soul", "Sam Cooke|A Change Is Gonna Come"],
    ["Funk", "James Brown|Get Up"],
    ["Disco", "Chic|Good Times"],
    ["Neo Soul", "Erykah Badu|On & On"],
    ["Reggae", "Bob Marley|Jamming"],
    ["Dub", "King Tubby|King Tubby Meets Rockers Uptown"],
    ["Dancehall", "Sister Nancy|Bam Bam"],
    ["Ska", "The Skatalites|Guns of Navarone"],
    ["Salsa", "Celia Cruz|Quimbara"],
    ["Reggaeton", "Daddy Yankee|Gasolina"],
    ["Bachata", "Aventura|Obsesion"],
    ["Bossa Nova", "Joao Gilberto|Chega de Saudade"],
    ["Samba", "Jorge Ben Jor|Mas Que Nada"],
    ["Bluegrass", "Bill Monroe|Blue Moon of Kentucky"],
    ["Americana", "The Band|The Weight"],
    ["Folk", "Bob Dylan|The Times They Are A-Changin'"],
    ["Delta Blues", "Robert Johnson|Sweet Home Chicago"],
    ["Chicago Blues", "Muddy Waters|Mannish Boy"],
    ["Afrobeat", "Fela Kuti|Water No Get Enemy"],
    ["Amapiano", "Kabza De Small|Sponono"],
    ["Qawwali", "Nusrat Fateh Ali Khan|Allah Hoo"],
    ["Video Game Music", "Koji Kondo|Super Mario Bros. Theme"],
    ["Film Score", "John Williams|Hedwig's Theme"],
    ["Musical Theater", "Lin-Manuel Miranda|My Shot"],
    ["Southern Gospel", "The Gaither Vocal Band|He Touched Me"]
  ].map(([genre, value]) => {
    const [artist, title] = value.split("|");
    return [genre, track(artist, title)];
  })
);

const genreFamilies = [];

const addFamily = (id, color, era, description, branches) => {
  genreFamilies.push({ id, color, era, description, branches });
};

addFamily("Rock", "#ff5f57", "1950s to now", "Guitars, backbeats, distortion, and scenes that keep mutating.", {
  "Roots Rock": "Rock and Roll|Rockabilly|Surf Rock|Garage Rock|Blues Rock|Southern Rock",
  "Classic Rock": "Album Rock|Arena Rock|Heartland Rock|Glam Rock|Psychedelic Rock|Folk Rock",
  "Alternative Rock": "College Rock|Grunge|Britpop|Shoegaze|Post-Rock|Math Rock|Noise Rock",
  "Indie Rock": "Jangle Pop|Lo-Fi Indie|Dream Pop|Post-Punk Revival|Art Rock|Emo",
  "Hard Rock": "Stoner Rock|Desert Rock|Sleaze Rock|Gothic Rock|Industrial Rock|Rap Rock"
});

addFamily("Metal", "#d73f35", "late 1960s to now", "Amplified heaviness, speed, atmosphere, and technical extremes.", {
  "Heavy Metal": "New Wave of British Heavy Metal|Speed Metal|Power Metal|Traditional Doom|Glam Metal|Shock Rock",
  "Extreme Metal": "Thrash Metal|Death Metal|Black Metal|Grindcore|War Metal|Technical Death Metal",
  "Doom Metal": "Stoner Metal|Sludge Metal|Funeral Doom|Drone Metal|Gothic Metal",
  "Progressive Metal": "Mathcore|Djent|Symphonic Metal|Avant-Garde Metal|Post-Metal",
  "Metalcore": "Deathcore|Melodic Metalcore|Nintendocore|Trancecore|Beatdown Hardcore"
});

addFamily("Punk and Hardcore", "#f7b801", "1970s to now", "Fast, direct, stubborn, and built around scenes as much as songs.", {
  "Punk Rock": "Proto-Punk|Anarcho-Punk|Street Punk|Oi!|Skate Punk|Pop Punk",
  "Hardcore Punk": "Straight Edge|Youth Crew|Powerviolence|Crust Punk|D-Beat|Crossover Thrash",
  "Post-Punk": "No Wave|Dance-Punk|Gothic Punk|Cold Wave|Deathrock",
  "Emo and Screamo": "Midwest Emo|Emo Pop|Screamo|Post-Hardcore|Melodic Hardcore"
});

addFamily("Pop", "#ff7a59", "1950s to now", "Hooks, personality, production polish, and sounds built for replay.", {
  "Traditional Pop": "Vocal Pop|Brill Building Pop|Sunshine Pop|Baroque Pop|Sophisti-Pop",
  "Dance Pop": "Eurodance|Teen Pop|Bubblegum Pop|Hi-NRG|Freestyle Pop",
  Synthpop: "Electropop|New Romantic|Futurepop|Chillwave|Indietronica",
  "Global Pop": "K-Pop|J-Pop|C-Pop|Mandopop|Cantopop|Afrobeats Pop",
  "Alternative Pop": "Art Pop|Dream Pop|Indie Pop|Bedroom Pop|Anti-Pop",
  "Pop Rock": "Power Pop|Soft Rock|Yacht Rock|Piano Pop|Pop Punk",
  Hyperpop: "Bubblegum Bass|Digicore|Glitch Pop|PC Music|Nightcore"
});

addFamily("Hip Hop", "#2de2c2", "1970s to now", "Rhythm, voice, production, and regional language in constant motion.", {
  "Old School Hip Hop": "Electro Rap|Golden Age Hip Hop|Party Rap|Turntablism",
  "Boom Bap": "East Coast Hip Hop|Jazz Rap|Conscious Hip Hop|Backpack Rap|Underground Hip Hop",
  "Gangsta Rap": "West Coast Hip Hop|G-Funk|Mafioso Rap|Horrorcore|Memphis Rap",
  "Southern Hip Hop": "Trap|Crunk|Snap Music|Bounce|Chopped and Screwed",
  "Global Hip Hop": "Grime|Drill|UK Rap|Kwaito Rap|Latin Rap|French Rap",
  "Alternative Hip Hop": "Cloud Rap|Lo-fi Hip Hop|Experimental Hip Hop|Abstract Hip Hop|Phonk"
});

addFamily("Electronic", "#36c9a7", "1940s to now", "Synths, samplers, sequencers, sound design, and machine grooves.", {
  House: "Deep House|Acid House|Progressive House|Tech House|Microhouse|Electro House",
  Techno: "Detroit Techno|Minimal Techno|Acid Techno|Hard Techno|Dub Techno|Industrial Techno",
  Trance: "Progressive Trance|Psytrance|Goa Trance|Uplifting Trance|Tech Trance",
  "Drum and Bass": "Jungle|Liquid Funk|Neurofunk|Jump-Up|Darkstep|Drumfunk",
  Dubstep: "Brostep|Post-Dubstep|Riddim|Future Garage|Wonky",
  Breakbeat: "Big Beat|Nu Skool Breaks|Breakcore|Electroclash|Miami Bass",
  Ambient: "Dark Ambient|Space Ambient|Ambient Techno|Drone|Lowercase",
  IDM: "Glitch|Braindance|Microsound|Folktronica|Vaporwave|Synthwave"
});

addFamily("Dance and Club", "#92d050", "1970s to now", "Floor-first rhythms shaped by DJs, sound systems, and local rooms.", {
  "Club Classics": "Disco|Italo Disco|Nu-Disco|Hi-NRG|Eurobeat|Eurodance",
  EDM: "Big Room House|Future Bass|Moombahton|Melbourne Bounce|Complextro",
  "Global Club": "Baile Funk|Kuduro|Afro House|Gqom|Amapiano|Shangaan Electro",
  "Bass Club": "Jersey Club|Baltimore Club|Footwork|Juke|UK Funky|Bassline",
  "Queer Club": "Vogue|Ballroom|Hardbag|Circuit House|Tribal House"
});

addFamily("Jazz", "#f2d94e", "1890s to now", "Improvisation, swing, blue notes, and harmonic conversation.", {
  "Early Jazz": "Ragtime|Dixieland|New Orleans Jazz|Stride|Hot Jazz",
  Swing: "Big Band|Jump Blues|Gypsy Jazz|Western Swing|Vocal Jazz",
  Bebop: "Hard Bop|Cool Jazz|Modal Jazz|Post-Bop|Soul Jazz",
  "Avant-Jazz": "Free Jazz|Spiritual Jazz|Third Stream|Avant-Garde Jazz|ECM Jazz",
  "Jazz Fusion": "Jazz Funk|Latin Jazz|Smooth Jazz|Acid Jazz|Nu Jazz|Jazz Rap"
});

addFamily("Classical", "#c4d6b0", "medieval to now", "Composed forms, orchestration, notation, and long arcs of style.", {
  "Early Music": "Medieval|Renaissance|Gregorian Chant|Madrigal|Plainchant",
  Baroque: "Concerto Grosso|Fugue|Oratorio|Baroque Opera|Chamber Sonata",
  "Classical Period": "Symphony|String Quartet|Concerto|Sonata|Opera Buffa",
  Romantic: "Lieder|Tone Poem|Ballet|Grand Opera|Nationalist Classical",
  "Modern Classical": "Impressionism|Expressionism|Serialism|Minimalism|Contemporary Classical|Neoclassical"
});

addFamily("R&B and Soul", "#ff6b8a", "1940s to now", "Groove, voice, gospel roots, funk muscle, and intimate production.", {
  "Rhythm and Blues": "Jump Blues|Doo-Wop|New Orleans R&B|British R&B|Blue-Eyed Soul",
  Soul: "Southern Soul|Chicago Soul|Motown|Northern Soul|Philly Soul",
  Funk: "P-Funk|Go-Go|Funk Rock|Boogie|Minneapolis Sound",
  "Modern R&B": "Quiet Storm|New Jack Swing|Contemporary R&B|Neo Soul|Alternative R&B",
  Disco: "Post-Disco|Boogie Funk|Disco House|Cosmic Disco|Space Disco"
});

addFamily("Reggae and Caribbean", "#7bd85c", "1950s to now", "Island rhythm, bass culture, sound-system pressure, and carnival energy.", {
  "Jamaican Roots": "Mento|Ska|Rocksteady|Roots Reggae|Dub",
  Dancehall: "Ragga|Digital Dancehall|Lovers Rock|Reggae Fusion|Dub Poetry",
  "Carnival Sounds": "Calypso|Soca|Chutney|Bouyon|Power Soca",
  "French Caribbean": "Zouk|Kompa|Cadence-Lypso|Gwo Ka|Biguine"
});

addFamily("Country and Folk", "#d0bf54", "1800s to now", "Story songs, strings, regional roots, and plainspoken detail.", {
  Country: "Traditional Country|Honky Tonk|Nashville Sound|Outlaw Country|Country Pop|Bro-Country",
  Bluegrass: "Old-Time|Progressive Bluegrass|Newgrass|Appalachian Folk|Cajun",
  Americana: "Alt-Country|Country Rock|Red Dirt|Roots Rock|Southern Gothic",
  Folk: "Contemporary Folk|Indie Folk|Singer-Songwriter|Celtic Folk|Protest Song|Freak Folk",
  "Western Sounds": "Western Swing|Cowboy Music|Tex-Mex|Norteno Country"
});

addFamily("Latin", "#ff9f1c", "1800s to now", "Dance, percussion, romance, regional identity, and hybrid pop force.", {
  "Afro-Cuban": "Son Cubano|Mambo|Cha-Cha-Cha|Rumba|Guaguanco",
  Salsa: "Salsa Dura|Salsa Romantica|Timba|Boogaloo|Latin Jazz",
  "Caribbean Latin": "Bachata|Merengue|Reggaeton|Latin Trap|Dembow",
  "South American": "Cumbia|Vallenato|Tango|Bossa Nova|Samba|MPB",
  "Mexican Regional": "Mariachi|Norteno|Banda|Ranchera|Corrido|Tejano",
  "Iberian and Pop": "Flamenco|Rumba Flamenca|Latin Pop|Rock en Espanol|Nueva Cancion"
});

addFamily("Blues", "#42b883", "1890s to now", "Bent notes, call-and-response, guitar language, and hard-won feeling.", {
  "Country Blues": "Delta Blues|Piedmont Blues|Texas Blues|Hill Country Blues|Acoustic Blues",
  "Electric Blues": "Chicago Blues|Detroit Blues|Louisiana Blues|Swamp Blues|West Coast Blues",
  "Piano Blues": "Boogie-Woogie|Barrelhouse|New Orleans Blues|Jump Blues",
  "Modern Blues": "Blues Rock|Soul Blues|Gospel Blues|Harmonica Blues|Electric Texas Blues"
});

addFamily("World and Regional", "#9ed86b", "ancient traditions to now", "Local instruments, languages, ceremonies, pop hybrids, and migration paths.", {
  "West Africa": "Afrobeat|Highlife|Juju|Fuji|Palm-Wine",
  "Central and East Africa": "Soukous|Taarab|Ethio-Jazz|Benga|Mbalax",
  "Southern Africa": "Amapiano|Kwaito|Gqom|Mbube|Shangaan Electro",
  "North Africa and Middle East": "Rai|Gnawa|Shaabi|Dabke|Arabic Pop",
  "South Asia": "Qawwali|Hindustani Classical|Carnatic|Bollywood|Bhangra",
  "Europe and Asia-Pacific": "Klezmer|Fado|Gamelan|Enka|Dangdut|Tuvan Throat Singing"
});

addFamily("Experimental", "#9a7d4f", "1900s to now", "Sound as raw material, from tape and noise to silence and texture.", {
  "Tape and Studio": "Musique Concrete|Sound Collage|Tape Music|Electroacoustic|Acousmatic",
  Noise: "Harsh Noise|Power Electronics|Japanoise|Noise Rock|Noisecore",
  Drone: "Drone Ambient|Drone Metal|Minimal Drone|Raga Drone|Doom Drone",
  Industrial: "Industrial|Post-Industrial|EBM|Martial Industrial|Neue Deutsche Harte",
  "Outer Forms": "Free Improvisation|Field Recording|Glitch|Lowercase|Sound Art"
});

addFamily("New Age and Spiritual", "#8fd694", "1960s to now", "Calm, ritual, devotional voice, spacious synths, and healing intent.", {
  "New Age": "Space Music|Ambient New Age|Healing Music|Nature Sounds|Relaxation Music",
  Devotional: "Kirtan|Chant|Bhajan|Gospel Meditation|Sufi Music",
  "World Fusion": "Celtic New Age|Native American Flute|Yoga Music|Neoclassical New Age|Pan Flute"
});

addFamily("Stage and Screen", "#ffcf56", "1800s to now", "Music built for characters, scenes, titles, credits, and big entrances.", {
  "Theater Music": "Musical Theater|Operetta|Cabaret|Vaudeville|Tin Pan Alley",
  "Screen Scores": "Film Score|TV Theme|Trailer Music|Library Music|Anime Soundtrack",
  "Game and Media": "Video Game Music|Chiptune|Interactive Score|JRPG Soundtrack|Rhythm Game Music"
});

addFamily("Gospel", "#f4a261", "1700s to now", "Faith, harmony, testimony, choirs, handclaps, and full-throated release.", {
  "Black Gospel": "Traditional Gospel|Urban Contemporary Gospel|Gospel Blues|Gospel Soul|Gospel Choir",
  "Southern Gospel": "Bluegrass Gospel|Country Gospel|Quartet Gospel|Progressive Southern Gospel",
  "Christian Pop": "Contemporary Christian|Worship Music|Christian Rock|Christian Hip Hop|Praise and Worship"
});

const crossLinks = [
  ["Blues Rock", "Electric Blues"],
  ["Rock and Roll", "Rhythm and Blues"],
  ["Hard Rock", "Heavy Metal"],
  ["Stoner Rock", "Stoner Metal"],
  ["Industrial Rock", "Industrial"],
  ["Rap Rock", "Alternative Hip Hop"],
  ["Punk Rock", "Hardcore Punk"],
  ["Post-Punk", "Alternative Rock"],
  ["Emo", "Midwest Emo"],
  ["Pop Punk", "Emo Pop"],
  ["Synthpop", "New Romantic"],
  ["Electropop", "Dance Pop"],
  ["K-Pop", "Dance Pop"],
  ["Afrobeats Pop", "Afrobeat"],
  ["Hyperpop", "Bubblegum Bass"],
  ["Trap", "EDM"],
  ["Drill", "UK Rap"],
  ["Grime", "UK Garage"],
  ["Jazz Rap", "Hip Hop"],
  ["Cloud Rap", "Ambient"],
  ["House", "Disco House"],
  ["Techno", "Industrial Techno"],
  ["Ambient Techno", "Ambient"],
  ["Jungle", "Breakcore"],
  ["Future Garage", "UK Funky"],
  ["Footwork", "Juke"],
  ["Amapiano", "Afro House"],
  ["Baile Funk", "Latin Trap"],
  ["Vogue", "Disco"],
  ["Big Band", "Swing"],
  ["Jump Blues", "Rhythm and Blues"],
  ["Jazz Funk", "Funk"],
  ["Latin Jazz", "Salsa"],
  ["Third Stream", "Modern Classical"],
  ["Minimalism", "Ambient"],
  ["Opera", "Musical Theater"],
  ["Ballet", "Screen Scores"],
  ["Motown", "Soul"],
  ["P-Funk", "Funk Rock"],
  ["Boogie", "Post-Disco"],
  ["Neo Soul", "Alternative R&B"],
  ["Ska", "Rocksteady"],
  ["Dub", "Dub Techno"],
  ["Dancehall", "Reggaeton"],
  ["Soca", "Calypso"],
  ["Zouk", "Kompa"],
  ["Bluegrass", "Old-Time"],
  ["Country Rock", "Southern Rock"],
  ["Americana", "Roots Rock"],
  ["Tex-Mex", "Tejano"],
  ["Bossa Nova", "Jazz"],
  ["Samba", "MPB"],
  ["Norteno", "Corrido"],
  ["Flamenco", "Rumba Flamenca"],
  ["Delta Blues", "Rock and Roll"],
  ["Gospel Blues", "Traditional Gospel"],
  ["Afrobeat", "Jazz Funk"],
  ["Ethio-Jazz", "Spiritual Jazz"],
  ["Qawwali", "Sufi Music"],
  ["Bhangra", "Dance Pop"],
  ["Gamelan", "Minimalism"],
  ["Noise Rock", "Harsh Noise"],
  ["Drone Metal", "Doom Metal"],
  ["Glitch", "IDM"],
  ["Field Recording", "Nature Sounds"],
  ["Chiptune", "Video Game Music"],
  ["Anime Soundtrack", "J-Pop"],
  ["Christian Hip Hop", "Hip Hop"],
  ["Gospel Soul", "Soul"]
];

const splitGenres = (genres) => genres.split("|");

const sampleFor = (id, familyId, index) => {
  const selectedPool = samplePools[familyId] || samplePools.Music;
  const selected = sampleOverrides[id] || selectedPool[index % selectedPool.length];

  return {
    ...selected,
    query: selected.query || `${selected.artist} ${selected.title}`,
    source: "Apple Music preview search"
  };
};

const nodeDescription = (id, family, parent, level) => {
  if (level === 0) {
    return "A connected atlas of genre families, scenes, and neighboring sounds.";
  }

  if (level === 1) {
    return family.description;
  }

  if (level === 2) {
    return `${id} is a hub inside ${family.id}, linking nearby scenes and substyles.`;
  }

  return `${id} grows from ${parent} and sits close to related ${family.id} sounds.`;
};

const createGenreGraph = () => {
  const nodes = [];
  const links = [];
  const seenNodes = new Set();
  const seenLinks = new Set();

  const addNode = (node) => {
    if (seenNodes.has(node.id)) {
      return;
    }

    seenNodes.add(node.id);
    nodes.push(node);
  };

  const addLink = (source, target, type = "related") => {
    if (!seenNodes.has(source) || !seenNodes.has(target) || source === target) {
      return;
    }

    const key = [source, target].sort().join("::");
    if (seenLinks.has(key)) {
      return;
    }

    seenLinks.add(key);
    links.push({ source, target, type });
  };

  addNode({
    id: ROOT_ID,
    group: "root",
    family: "All",
    parent: null,
    level: 0,
    color: "#f2d94e",
    era: "all eras",
    description: nodeDescription(ROOT_ID, null, null, 0),
    sample: sampleFor(ROOT_ID, "Music", 0)
  });

  genreFamilies.forEach((family, familyIndex) => {
    let sampleIndex = familyIndex;

    addNode({
      id: family.id,
      group: family.id,
      family: family.id,
      parent: ROOT_ID,
      level: 1,
      color: family.color,
      era: family.era,
      description: nodeDescription(family.id, family, ROOT_ID, 1),
      sample: sampleFor(family.id, family.id, sampleIndex)
    });
    addLink(ROOT_ID, family.id, "family");

    const branchNames = Object.keys(family.branches);
    branchNames.forEach((branch, branchIndex) => {
      sampleIndex += 1;
      addNode({
        id: branch,
        group: family.id,
        family: family.id,
        parent: family.id,
        level: 2,
        color: family.color,
        era: family.era,
        description: nodeDescription(branch, family, family.id, 2),
        sample: sampleFor(branch, family.id, sampleIndex)
      });
      addLink(family.id, branch, "branch");

      if (branchIndex > 0) {
        addLink(branchNames[branchIndex - 1], branch, "sibling");
      }

      const genres = splitGenres(family.branches[branch]);
      genres.forEach((genre, genreIndex) => {
        sampleIndex += 1;
        addNode({
          id: genre,
          group: family.id,
          family: family.id,
          parent: branch,
          level: 3,
          color: family.color,
          era: family.era,
          description: nodeDescription(genre, family, branch, 3),
          sample: sampleFor(genre, family.id, sampleIndex)
        });
        addLink(branch, genre, "subgenre");

        if (genreIndex > 0) {
          addLink(genres[genreIndex - 1], genre, "neighbor");
        }
      });
    });
  });

  crossLinks.forEach(([source, target]) => addLink(source, target, "influence"));

  return {
    nodes,
    links,
    families: genreFamilies.map(({ id, color, era, description }) => ({
      id,
      color,
      era,
      description
    })),
    stats: {
      nodes: nodes.length,
      links: links.length,
      families: genreFamilies.length
    }
  };
};

module.exports = {
  createGenreGraph
};
