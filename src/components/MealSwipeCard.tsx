import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Meal } from "@/types/grocery";
import { Clock, Flame, Dumbbell } from "lucide-react";
import { mealImages } from "@/assets/meals";

interface MealSwipeCardProps {
  meal: Meal;
  onSwipe: (direction: "left" | "right") => void;
}

const MealSwipeCard = ({ meal, onSwipe }: MealSwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityLeft = useTransform(x, [-100, 0], [1, 0]);
  const opacityRight = useTransform(x, [0, 100], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
  };

  const typeEmoji = {
    breakfast: "🌅",
    lunch: "☀️",
    dinner: "🌙",
    snack: "🍿",
  };

  const image = mealImages[meal.id];

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      className="absolute w-full cursor-grab active:cursor-grabbing"
    >
      <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
        {/* Swipe indicators */}
        <motion.div
          style={{ opacity: opacityRight }}
          className="absolute top-4 left-4 z-10 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-bold"
        >
          ✓ Keep
        </motion.div>
        <motion.div
          style={{ opacity: opacityLeft }}
          className="absolute top-4 right-4 z-10 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold"
        >
          ✗ Skip
        </motion.div>

        {/* Image header */}
        {image ? (
          <div className="relative h-40 overflow-hidden">
            <img
              src={image}
              alt={meal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <span className="text-xs opacity-80 text-white">
                {typeEmoji[meal.type]} {meal.day} · {meal.type}
              </span>
              <h3 className="text-lg font-display font-bold text-white mt-0.5">
                {meal.name}
              </h3>
            </div>
          </div>
        ) : (
          <div className="h-32 bg-gradient-primary flex items-end p-5">
            <div>
              <span className="text-sm opacity-80 text-primary-foreground">
                {typeEmoji[meal.type]} {meal.day} · {meal.type}
              </span>
              <h3 className="text-xl font-display font-bold text-primary-foreground mt-1">
                {meal.name}
              </h3>
            </div>
          </div>
        )}

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">{meal.description}</p>

          {/* Macros */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Flame size={14} className="text-accent" />
              <span className="font-semibold text-foreground">{meal.calories}</span>
              <span className="text-muted-foreground">cal</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Dumbbell size={14} className="text-primary" />
              <span className="font-semibold text-foreground">{meal.protein}g</span>
              <span className="text-muted-foreground">protein</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock size={14} className="text-muted-foreground" />
              <span className="font-semibold text-foreground">{meal.prepTime}</span>
              <span className="text-muted-foreground">min</span>
            </div>
          </div>

          {/* Macro bars */}
          <div className="space-y-2">
            <MacroBar label="Protein" value={meal.protein} max={60} color="bg-primary" />
            <MacroBar label="Carbs" value={meal.carbs} max={80} color="bg-accent" />
            <MacroBar label="Fat" value={meal.fat} max={40} color="bg-warning" />
          </div>

          {/* Ingredients preview */}
          <div className="flex flex-wrap gap-1.5">
            {meal.ingredients.slice(0, 4).map((ing) => (
              <span
                key={ing}
                className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full"
              >
                {ing}
              </span>
            ))}
            {meal.ingredients.length > 4 && (
              <span className="text-xs text-muted-foreground px-2.5 py-1">
                +{meal.ingredients.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MacroBar = ({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-muted-foreground w-14">{label}</span>
    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
    <span className="text-xs font-medium text-foreground w-8 text-right">{value}g</span>
  </div>
);

export default MealSwipeCard;
