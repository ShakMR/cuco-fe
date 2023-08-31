export class ProjectNotFount extends Error {
  private shortName: string;
  constructor(shortName: string) {
    super(`Project with name ${shortName} not found`);
    this.shortName = shortName;
  }
}
