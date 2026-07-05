import React from 'react'
import ActionTile from './ActionTile'
import { Plus, ListChecks, BarChart3 } from 'lucide-react'

const QuickActions = () => {
  return (
    <div className="card-surface p-6">
              <div>
                <h3 className="font-display text-base font-semibold">Quick Actions</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Shortcuts to get things done</p>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <ActionTile icon={Plus} title="New Project" sub="Create a new project" primary />
                <ActionTile icon={ListChecks} title="New Task" sub="Add a new task" />
                <ActionTile icon={BarChart3} title="AI Analytics" sub="Get insights" />
              </div>
    </div>
  )
}

export default QuickActions