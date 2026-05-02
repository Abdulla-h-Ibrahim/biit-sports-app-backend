const connectDB = require('../config/databaseConnection');
const User = require('../models/userModel');
const Team = require('../models/teamModel');

async function clearInvites() {
  await connectDB();

  const userResult = await User.updateMany(
    {},
    {
      $pull: {
        notifications: {
          type: { $in: ['team_invite', 'invite_accepted', 'invite_rejected'] },
        },
      },
    }
  );

  const teams = await Team.find({});
  let teamsUpdated = 0;

  for (const team of teams) {
    let changed = false;

    for (const member of team.members) {
      if (member.inviteStatus !== 'accepted') {
        member.inviteStatus = 'accepted';
        changed = true;
      }
    }

    if (team.teamStatus !== 'completed') {
      team.teamStatus = 'completed';
      changed = true;
    }

    if (changed) {
      await team.save();
      teamsUpdated += 1;
    }
  }

  console.log(`Invite notifications cleaned for users: ${userResult.modifiedCount}`);
  console.log(`Teams updated: ${teamsUpdated}`);
  process.exit(0);
}

clearInvites().catch((error) => {
  console.error('Failed to clear invites:', error.message);
  process.exit(1);
});
