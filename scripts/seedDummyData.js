const connectDB = require('../config/databaseConnection');
const Sport = require('../models/sportModel');
const Team = require('../models/teamModel');
const Match = require('../models/matchModel');
const Result = require('../models/resultModel');
const User = require('../models/userModel');

function buildSports() {
  return [
    { name: 'Cricket', type: 'team', minPlayers: 11, maxPlayers: 11, description: 'T20 style tournament' },
    { name: 'Football', type: 'team', minPlayers: 11, maxPlayers: 11, description: 'Standard 11-a-side matches' },
    { name: 'Futsal', type: 'team', minPlayers: 5, maxPlayers: 5, description: 'Indoor fast-paced football' },
    { name: 'Basketball', type: 'team', minPlayers: 5, maxPlayers: 5, description: 'Full court format' },
    { name: 'Volleyball', type: 'team', minPlayers: 6, maxPlayers: 6, description: '6-player squads' },
    { name: 'Badminton Singles', type: 'individual', minPlayers: 1, maxPlayers: 1, description: 'Singles bracket' },
    { name: 'Badminton Doubles', type: 'duo', minPlayers: 1, maxPlayers: 1, description: 'Team registration disabled for doubles' },
    { name: 'Table Tennis', type: 'individual', minPlayers: 1, maxPlayers: 1, description: 'Singles knockout' },
    { name: 'Chess', type: 'individual', minPlayers: 1, maxPlayers: 1, description: 'Rapid chess format' },
    { name: 'Esports Valorant', type: 'team', minPlayers: 5, maxPlayers: 5, description: '5v5 tactical shooter' },
  ];
}

async function createTeamsForSport(sport, users, startOffset) {
  const teamSize = sport.maxPlayers;
  const teams = [];

  for (let teamIndex = 0; teamIndex < 2; teamIndex += 1) {
    const members = [];
    for (let playerIndex = 0; playerIndex < teamSize; playerIndex += 1) {
      const user = users[(startOffset + teamIndex * teamSize + playerIndex) % users.length];
      members.push({
        user: user._id,
        role: playerIndex === 0 ? 'captain' : 'player',
        inviteStatus: playerIndex === 0 ? 'accepted' : 'pending',
      });
    }

    teams.push({
      name: `${sport.name} Team ${teamIndex + 1}`,
      sport: sport._id,
      createdBy: members[0].user,
      members,
    });
  }

  return Team.insertMany(teams);
}

async function seed() {
  await connectDB();

  await Result.deleteMany({});
  await Match.deleteMany({});
  await Team.deleteMany({});
  await Sport.deleteMany({});
  const users = await User.find({ role: 'player' }).limit(200);
  if (!users.length) {
    throw new Error('No player users found. Please run npm run import:players first.');
  }
  const sports = await Sport.insertMany(buildSports());

  let userOffset = 0;
  const createdTeams = [];

  for (const sport of sports) {
    if (sport.type !== 'team') continue;
    const teams = await createTeamsForSport(sport, users, userOffset);
    createdTeams.push(...teams);
    userOffset += sport.maxPlayers * 2;
  }

  const matches = [];
  for (let index = 0; index < createdTeams.length; index += 2) {
    const team1 = createdTeams[index];
    const team2 = createdTeams[index + 1];
    if (!team1 || !team2) continue;

    matches.push({
      sport: team1.sport,
      team1: team1._id,
      team2: team2._id,
      matchDate: new Date(Date.now() + index * 86400000),
      venue: `BIIT Ground ${index / 2 + 1}`,
      status: index % 4 === 0 ? 'completed' : 'scheduled',
    });
  }

  const insertedMatches = await Match.insertMany(matches);

  const results = insertedMatches
    .filter((match) => match.status === 'completed')
    .map((match, index) => {
      const team1Score = 10 + index * 2;
      const team2Score = 8 + index;
      return {
        match: match._id,
        winner: team1Score >= team2Score ? match.team1 : match.team2,
        team1Score,
        team2Score,
        description: `Auto-seeded result for match at ${match.venue}`,
      };
    });

  if (results.length) {
    await Result.insertMany(results);
  }

  console.log('Dummy data seeded successfully.');
  console.log(`Users reused: ${users.length}`);
  console.log(`Sports: ${sports.length}`);
  console.log(`Teams: ${createdTeams.length}`);
  console.log(`Matches: ${insertedMatches.length}`);
  console.log(`Results: ${results.length}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});
