import documentSchema from "./schemas/documentSchema";

const MAX_VERSIONS = 50;

documentSchema.index({ updatedAt: -1 });
documentSchema.index({ createdAt: -1 });

documentSchema.methods.saveVersion = function (userId = "anonymous") {
  const newVersion = {
    content: JSON.parse(JSON.stringify(this.content)),
    createdBy: userId,
    versionNumber: this.currentVersion,
  };

  this.versions.push(newVersion);

  if (this.versions.length > MAX_VERSIONS) {
    this.versions = this.versions.slice(-MAX_VERSIONS);
  }

  this.currentVersion += 1;

  return newVersion;
};
