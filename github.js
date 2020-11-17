const fetch = require('node-fetch');

const getFollowersData = async (req, res) => {
	try {
		if (!req.query.primaryUser) {
			throw new Error('Please provide a valid primary user name');
		}

		if (!req.query.secondaryUser) {
			throw new Error('Please provide a valid secondary user name');
		}

		let primaryUserFollowing = await fetch(`https://api.github.com/users/${req.query.primaryUser}/following`)
			.then(res => res.json())
			.then(json => {
				return json;
			});
		if (primaryUserFollowing && primaryUserFollowing.message) {
			throw new Error(`${primaryUserFollowing.message}: ${req.query.primaryUser}`);
		}
		if(primaryUserFollowing.length == 0) {
			throw new Error(`No user followed by primary user: ${req.query.primaryUser}`)
		}

		let secondaryUserFollowers = await fetch(`https://api.github.com/users/${req.query.secondaryUser}/followers`)
			.then(res => res.json())
			.then(json => {
				return json;
			});
			if (secondaryUserFollowers && secondaryUserFollowers.message) {
				throw new Error(`${secondaryUserFollowers.message}: ${req.query.secondaryUser}`);
			}
			if(secondaryUserFollowers.length == 0) {
				throw new Error(`No user following secondary user: ${req.query.secondaryUser}`)
			}

		let commonUsers = primaryUserFollowing.filter(obj =>
			secondaryUserFollowers.some(({ id, login }) =>
				obj.id === id && obj.login === login
			)).map(user => {
				return { login: user.login, avatar_url: user.avatar_url, url: user.html_url };
			});
			
		res.status(200).render('followers', {followers: commonUsers, err: null, message: `No. of Common Followers Found: ${commonUsers.length}`});
	} catch (err) {
		res.status(404).render('followers',{follwers: [], err: err.message});
	}

}

module.exports = { getFollowersData };