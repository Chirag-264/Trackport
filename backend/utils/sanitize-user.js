export default function sanitizeUser(user) {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    userName: user.userName,
    email: user.email,
    college: user.college || '',
    branch: user.branch || '',
    graduationYear: user.graduationYear || null,
    githubUsername: user.githubUsername || '',
    leetcodeUsername: user.leetcodeUsername || '',
    codeforcesUsername: user.codeforcesUsername || '',
    dailyGoal: user.dailyGoal || 2,
    createdAt: user.createdAt
  };
}
