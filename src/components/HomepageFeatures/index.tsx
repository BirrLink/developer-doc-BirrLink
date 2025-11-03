import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Secure Payments',
    image: '/img/cover.png',
    description: (
      <>
        BirrLink provides secure and reliable payment processing for businesses in Ethiopia.
      </>
    ),
  },
  {
    title: 'Easy Integration',
    image: '/img/cover.png',
    description: (
      <>
        Integrate our payment solution into your platform with our comprehensive APIs and SDKs.
      </>
    ),
  },
  {
    title: 'Reliable Service',
    image: '/img/cover.png',
    description: (
      <>
        Experience high availability and reliability with our robust payment infrastructure.
      </>
    ),
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={image} className={styles.featureSvg} role="img" alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
