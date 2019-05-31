import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'

import { Heading, Flex } from 'primitives'

import PricingColumn from 'components/PricingColumn'
import Layout from 'components/Layout'
import SEO from 'components/Seo'

export default function Pricing(props) {
  const [hasMounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const plans = props.data.allStripePlan.edges
  const products = props.data.allStripeProduct.edges.map(product => {
    const matchingPlans = plans.map(({ node }) => node).filter(plan => plan.product === product.node.id)
    return {
      ...product.node,
      plans: matchingPlans,
    }
  })

  const sortedProducts = products.sort((a, b) => parseInt(a.metadata.position, 10) > parseInt(b.metadata.position, 10))

  return (
    <Layout location={props.location}>
      <SEO title="Pricing" />
      <Heading marginTop={0} size={500} textAlign="center">
        Flexible plans for companies of all sizes.
      </Heading>
      <Heading h={2} marginTop={0} marginBottom={160} opacity={0.4} size={360} textAlign="center">
        Our plans are simple and straightforward.
      </Heading>
      <Flex alignItems="center">
        {sortedProducts.map(product => (
          <PricingColumn key={product.id} hasMounted={hasMounted} product={product} />
        ))}
      </Flex>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    allStripeProduct {
      edges {
        node {
          active
          id
          metadata {
            position
            recommended
            cta
            perks
          }
          name
        }
      }
    }
    allStripePlan {
      edges {
        node {
          active
          amount
          billing_scheme
          created
          id
          interval
          nickname
          product
          trial_period_days
        }
      }
    }
  }
`