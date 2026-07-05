import React from 'react'
import StatsCard from './StatsCard'
const StatsGrid = ({stats}) => {
  return (
    <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
            <StatsCard s={s} key={s.label} />
        ))}
    </section>
  )
}

export default StatsGrid