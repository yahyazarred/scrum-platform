import React from 'react';
import type { ProjectMembershipData } from '../../services/project.api';
import styles from './ProjectCard.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";

interface ProjectCardProps {
    membership: ProjectMembershipData;
    onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ membership, onClick }) => {
    return (
        <div className={styles.projectCard} onClick={onClick}>
            <div className={styles.header}>
                <h3 className={styles.title}>{membership.project?.name || "Unknown Project"}</h3>
                {membership.project?.githubLink && (
                    <a href={membership.project.githubLink} target="_blank" rel="noopener noreferrer" className={styles.githubLink} onClick={(e) => e.stopPropagation()}>
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                )}
            </div>

            {membership.project?.projectGoal && (
                <div className={styles.projectGoal}>
                    <strong>Goal:</strong> {membership.project.projectGoal}
                </div>
            )}
            
            {membership.project?.description && (
                <p className={styles.projectDesc}>{membership.project.description}</p>
            )}

            {/* Highlight join codes only for the Product Owner */}
            {membership.role === 'product_owner' && membership.project?.joinCodes && (
                <div className={styles.joinCodesContainer}>
                    <div className={styles.codeRow}>
                        <span>Scrum Master Code:</span>
                        <code className={styles.codePurple}>{membership.project.joinCodes.scrumMaster}</code>
                    </div>
                    <div className={styles.codeRow}>
                        <span>Developer Code:</span>
                        <code className={styles.codeBlue}>{membership.project.joinCodes.developer}</code>
                    </div>
                </div>
            )}

            <div className={styles.projectRole}>
                <span className={`${styles.roleBadge} ${styles[membership.role]}`}>
                    {membership.role.replace("_", " ")}
                </span>
            </div>
        </div>
    );
};
