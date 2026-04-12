/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions }) => {
  const { createPage, createRedirect } = actions
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })

  createRedirect({
    fromPath: "/page-2",
    toPath: "/concept-1",
    isPermanent: true,
    redirectInBrowser: true,
  })

  createRedirect({
    fromPath: "/using-typescript",
    toPath: "/concept-2",
    isPermanent: true,
    redirectInBrowser: true,
  })
}
