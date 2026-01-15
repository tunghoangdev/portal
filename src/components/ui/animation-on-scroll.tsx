import { HTMLMotionProps, motion, Variants } from 'framer-motion';
type IProps = HTMLMotionProps<'div'> & {
  motionVariants?: Variants;
};

const scrollSection: Variants = {
  hidden: {
    opacity: 0,
    visibility: 'hidden',
    y: 80,
    // rotate: -5,
  },
  visible: {
    opacity: 1,
    visibility: 'inherit',
    y: 0,
    // rotate: 0,
    transition: {
      type: 'tween',
      duration: 1.5,
    },
  },
};

export default function AnimationOnScroll(props: IProps) {
  const { children, motionVariants } = props;
  const variantScroll = motionVariants || scrollSection;
  return (
    <motion.div
      initial={'hidden'}
      whileInView={'visible'}
      viewport={{ once: true }}
      variants={variantScroll}
      {...props}
    >
      {children}
    </motion.div>
  );
}
