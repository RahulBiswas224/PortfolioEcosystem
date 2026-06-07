ALTER TABLE "authors" 
ADD COLUMN "password" TEXT NOT NULL DEFAULT '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';

ALTER TABLE "authors"
ADD COLUMN "githubUrl" TEXT,
ADD COLUMN "linkedinUrl" TEXT,
ADD COLUMN "twitterUrl" TEXT;

ALTER TABLE "authors" ALTER COLUMN "password" DROP DEFAULT;