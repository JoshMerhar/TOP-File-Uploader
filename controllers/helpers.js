const unauthLinks = [
    { href: '/', text: 'Home' },
    { href: '/login', text: 'Log In' },
    { href: '/user/signup', text: 'Create Account' }
];

const authLinks = [
    { href: '/', text: 'Home' },
    { href: '/user/library', text: 'Library' },
    { href: '/logout', text: 'Log Out' }
]

module.exports = {
    unauthLinks,
    authLinks,
}