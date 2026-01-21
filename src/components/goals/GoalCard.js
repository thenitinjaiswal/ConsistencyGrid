import { useState } from "react";
import { MoreHorizontal, CheckCircle2, Circle, Trash2, Edit2, Pin, PinOff } from "lucide-react";
import Card from "@/components/ui/Card";

/**
 * Goal Card Component
 * Displays individual goal with progress bar, sub-goals, and expandable details
 */
export default function GoalCard({ goal, onToggleSubGoal, onDelete, onEdit, onPin }) {
    const [showAllSubGoals, setShowAllSubGoals] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isPinned, setIsPinned] = useState(goal.isPinned || false);
    const completedSubGoals = goal.subGoals.filter(sg => sg.isCompleted).length;
    const subGoalProgress = Math.round((completedSubGoals / goal.subGoals.length) * 100);
    const visibleSubGoals = showAllSubGoals ? goal.subGoals : goal.subGoals.slice(0, 2);
    const hiddenCount = goal.subGoals.length - 2;

    const categoryStyles = {
        "Health": "bg-red-100 text-red-700",
        "Wealth": "bg-green-100 text-green-700",
        "Mind": "bg-purple-100 text-purple-700",
        "Work": "bg-blue-100 text-blue-700",
        "Life Milestone": "bg-yellow-100 text-yellow-700",
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete goal "${goal.title}"?`)) {
            return;
        }
        
        try {
            const res = await fetch(`/api/goals?id=${goal.id}`, {
                method: "DELETE",
            });
            
            if (res.ok) {
                onDelete?.(goal.id);
            } else {
                console.error("Failed to delete goal");
                alert("Failed to delete goal. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting goal:", error);
            alert("Error deleting goal. Please try again.");
        }
    };

    const handlePin = async () => {
        try {
            const newPinStatus = !isPinned;
            const res = await fetch("/api/goals/pin", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goalId: goal.id, isPinned: newPinStatus })
            });

            if (res.ok) {
                setIsPinned(newPinStatus);
                onPin?.(goal.id, newPinStatus);
            } else {
                console.error("Failed to update pin status");
                alert("Failed to pin goal. Please try again.");
            }
        } catch (error) {
            console.error("Error pinning goal:", error);
            alert("Error pinning goal. Please try again.");
        }
    };

    return (
        <Card className="p-6 transition-all hover:shadow-md hover:border-orange-200 border-2 border-transparent">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase ${
                        categoryStyles[goal.category] || "bg-gray-100 text-gray-700"
                    }`}>
                        {goal.category}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-gray-900">{goal.title}</h3>
                    
                    {/* Deadline info */}
                    {goal.targetDeadline && (
                        <p className="text-xs text-gray-500 mt-1">
                            📅 Target: {new Date(goal.targetDeadline).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <div className="flex-shrink-0 relative">
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                                onClick={() => {
                                    handlePin();
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors border-b border-gray-100"
                            >
                                {isPinned ? (
                                    <>
                                        <PinOff className="w-4 h-4" />
                                        Unpin from Wallpaper
                                    </>
                                ) : (
                                    <>
                                        <Pin className="w-4 h-4" />
                                        Pin to Wallpaper
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    onEdit?.(goal);
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors border-b border-gray-100"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete();
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-500">Progress</span>
                    <span className="font-bold text-orange-600">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                    />
                </div>
            </div>

            {/* Sub-goals Summary */}
            <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex-1">
                    <span className="text-gray-600">
                        <span className="font-bold text-orange-600">{completedSubGoals}</span>
                        <span className="text-gray-500"> of {goal.subGoals.length} sub-goals completed</span>
                    </span>
                </div>
                {subGoalProgress === 100 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">
                        ✓ Complete
                    </span>
                )}
            </div>

            {/* Sub-goals List */}
            <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Next Steps</p>
                <div className="space-y-2">
                    {visibleSubGoals.map((subGoal) => (
                        <div key={subGoal.id} className="flex items-start gap-3 group">
                            <button
                                onClick={() => onToggleSubGoal(goal.id, subGoal.id)}
                                className={`mt-0.5 flex-shrink-0 transition-colors ${subGoal.isCompleted ? "text-orange-500" : "text-gray-300 hover:text-orange-400"
                                    }`}
                            >
                                {subGoal.isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 fill-current" />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                            </button>
                            <span className={`text-sm ${subGoal.isCompleted ? "text-gray-400 line-through" : "text-gray-600"
                                }`}>
                                {subGoal.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Show more button */}
                {hiddenCount > 0 && (
                    <button
                        onClick={() => setShowAllSubGoals(!showAllSubGoals)}
                        className="mt-3 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        {showAllSubGoals ? "Show less" : `+${hiddenCount} more sub-goals`}
                    </button>
                )}
            </div>
        </Card>
    );
}
